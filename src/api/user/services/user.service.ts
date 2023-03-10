import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from '../../../shared/modules/global-aws/global-aws.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { LKOwner } from '../../licensekey/schemas/licensekey.schema';
import { isValidUUID } from '../../../shared/utils/index';
import {
  AttributeType,
  UserType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { UserProfile, UserAttributesObj } from '../schemas/user.aws.schema';
import { CognitoCreateUserDTO } from '../dtos';
import { RadioMonitorService } from '../../radiomonitor/radiomonitor.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery, AnyObject, AnyKeys } from 'mongoose';
import { UserDB, UserSchemaName } from '../schemas/user.db.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserGroupService } from './user-group.service';
import { UserCompanyService } from './user-company.service';
import { GroupService } from '../../group/group.service';
import { CompanyService } from '../../company/company.service';
import { Roles, ApiKeyType, SystemRoles } from 'src/constants/Enums';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import { MongoosePaginateUserDto } from '../dtos/mongoosepaginate-user.dto';
import { ApiKeyService } from '../../api-key/api-key.service';
import { WpmsUserRegisterDTO } from 'src/api/auth/dto/register.dto';
import { LicenseKey } from 'src/api/licensekey/schemas/licensekey.schema';
import { CreateUserInCognitoDto } from '../dtos/index';

@Injectable()
export class UserService {
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  private cognitoUserPoolId: string;
  private clientId: string;
  constructor(
    @Inject(forwardRef(() => LicensekeyService))
    private readonly licensekeyService: LicensekeyService,
    @Inject(forwardRef(() => ApiKeyService))
    public readonly apiKeyService: ApiKeyService,
    private readonly globalAwsService: GlobalAwsService,
    private readonly groupService: GroupService,
    private readonly companyService: CompanyService,
    @InjectModel(UserSchemaName)
    public readonly userModel: Model<UserDB>,
    private readonly configService: ConfigService,
    public readonly userGroupService: UserGroupService,
    public readonly userCompanyService: UserCompanyService,

    @Inject(forwardRef(() => RadioMonitorService))
    private readonly radioMonitorService: RadioMonitorService,
  ) {
    this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
    this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get('COGNITO_CLIENT_ID');
  }

  //Add new existing license: Meaning just update the metadata field with ownerId
  async addNewLicense(licenseId: string, ownerIdOrUsername: string) {
    const key = await this.licensekeyService.licenseKeyModel.findById(
      licenseId,
    );
    if (!key) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Invalid license key',
      });
    }
    if (key.type == ApiKeyType.COMPANY) {
      return Promise.reject({
        status: 400,
        message:
          'You are trying to add a license that belongs to company type or a individual type.',
      });
    }

    const user = await this.getUserProfile(ownerIdOrUsername);
    if (!user) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'User not found',
      });
    }
    return this.licensekeyService.addOwnerToLicense(licenseId, user.sub);
  }

  async addBulkNewLicenses(licenseIds: [string], ownerIdOrUsername: string) {
    const user = await this.getUserProfile(ownerIdOrUsername).catch(err => {
      if (err.status == 404) {
        throw new NotFoundException(err.message);
      }
      throw err;
    });

    const promises = licenseIds.map(async licenseId => {
      return this.licensekeyService
        .addOwnerToLicense(licenseId, user.sub)
        .catch(err => ({
          promiseError: err,
          data: licenseId,
        }));
    });
    return Promise.all(promises).then(values => {
      const failedData = values.filter(item => item['promiseError']) as {
        promiseError: any;
        data: string;
      }[];
      const passedData = values.filter(item => !item['promiseError']);
      return {
        passedData: passedData,
        failedData: failedData,
      };
    });
  }

  /**
   * Get User profile by username or sub
   * @param usernameOrSub this can be username or sub
   */
  async getUserProfile(usernameOrSub: string) {
    if (isValidUUID(usernameOrSub)) {
      return this.findById(usernameOrSub);
    } else {
      return this.findOne({ username: usernameOrSub });
    }
  }

  /**
   * Get User profile by username or sub
   * @param usernameOrSub this can be username or sub
   */
  async adminListGroupsForUser(usernameOrSub: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: usernameOrSub,
    };
    if (isValidUUID(usernameOrSub)) {
      const { username } = await this.getCognitoUserFromSub(usernameOrSub);
      params.Username = username;
    }
    const adminListGroupsForUserResponse = await this.cognitoIdentityServiceProvider
      .adminListGroupsForUser(params)
      .promise();
    const groupNames = adminListGroupsForUserResponse.Groups.map(
      group => group.GroupName,
    );
    return {
      adminListGroupsForUserResponse: adminListGroupsForUserResponse,
      groupNames: groupNames,
    };
  }

  async cognitoCreateGroup(groupName: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Description: groupName,
      GroupName: groupName,
    };
    const cognitoCreateGroupResponse = await this.cognitoIdentityServiceProvider
      .createGroup(params)
      .promise();
    return {
      cognitoCreateGroup: cognitoCreateGroupResponse,
      groupName: groupName,
    };
  }

  async cognitoDeleteGroup(groupName: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      GroupName: groupName,
    };
    const cognitoDeleteGroupResponse = await this.cognitoIdentityServiceProvider
      .deleteGroup(params)
      .promise();
    return {
      cognitoDeleteGroup: cognitoDeleteGroupResponse,
      groupName: groupName,
    };
  }

  /**
   * @param groupName
   */
  async cognitoGetGroup(groupName: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      GroupName: groupName,
    };
    const group = await this.cognitoIdentityServiceProvider
      .getGroup(params)
      .promise();

    return group.Group;
  }

  async adminAddUserToGroup(usernameOrSub: string, groupName: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      GroupName: groupName,
      Username: usernameOrSub,
    };
    if (isValidUUID(usernameOrSub)) {
      const { username } = await this.getCognitoUserFromSub(usernameOrSub);
      params.Username = username;
    }
    const group = await this.cognitoIdentityServiceProvider
      .adminAddUserToGroup(params)
      .promise();

    return group;
  }

  async adminRemoveUserFromGroup(usernameOrSub: string, groupName: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      GroupName: groupName,
      Username: usernameOrSub,
    };
    if (isValidUUID(usernameOrSub)) {
      const { username } = await this.getCognitoUserFromSub(usernameOrSub);
      params.Username = username;
    }
    const group = await this.cognitoIdentityServiceProvider
      .adminRemoveUserFromGroup(params)
      .promise();

    return group;
  }

  async adminSetUserPassword(usernameOrSub: string, password: string) {
    const params = {
      Password: password,
      Permanent: true,
      Username: usernameOrSub,
      UserPoolId: this.cognitoUserPoolId,
    };
    if (isValidUUID(usernameOrSub)) {
      const { username } = await this.getCognitoUserFromSub(usernameOrSub);
      params.Username = username;
    }
    const setUserPasswordRes = await this.cognitoIdentityServiceProvider
      .adminSetUserPassword(params)
      .promise();

    return setUserPasswordRes;
  }

  async adminDeleteUser(usernameOrSub: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: usernameOrSub,
    };
    if (isValidUUID(usernameOrSub)) {
      const { username } = await this.getCognitoUserFromSub(usernameOrSub);
      params.Username = username;
    }
    const deleted = await this.cognitoIdentityServiceProvider
      .adminDeleteUser(params)
      .promise();

    return deleted;
  }

  convertUserAttributesToObj(
    userAttributeType: AttributeType[],
  ): UserAttributesObj {
    var attributesObj = {};
    for (let index = 0; index < userAttributeType.length; index++) {
      const element = userAttributeType[index];
      attributesObj[element.Name] = element.Value;
    }

    return attributesObj;
  }

  /**
   * Sync cognito user with our database, if usernameOrSub given,
   * it will sync only single user
   * @param usernameOrSub
   * @returns
   */
  async syncUserFromCognitoToMongooDb(usernameOrSub: string) {
    var userCreationOrUpdationResult = await this.createOrUpdateUserInDbFromCognitoUserName(
      usernameOrSub,
    );
    //Given default role as PORTAL_USER
    if (!userCreationOrUpdationResult.userDb.userRole) {
      const updatedUserWithRole = await this.update(
        userCreationOrUpdationResult.userDb._id,
        {
          userRole: SystemRoles.PORTAL_USER,
        },
      );
      userCreationOrUpdationResult.userDb = updatedUserWithRole;
    }
    return userCreationOrUpdationResult.userDb;
  }

  /**
   * Sync all cognito user with our database 60
   * @returns
   */
  async syncUsersFromCognitoToMongooDb(
    limit: number = 50,
    paginationToken: string = '',
    itritation: number = 1,
    usersCount: number = 0,
  ) {
    console.log(
      'Itritation',
      itritation,
      'limit',
      limit,
      'paginationToken',
      paginationToken,
    );
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Limit: limit,
    };
    if (paginationToken) {
      params['PaginationToken'] = paginationToken;
    }
    var {
      Users,
      PaginationToken,
    } = await this.cognitoIdentityServiceProvider.listUsers(params).promise();
    usersCount = usersCount + Users.length;
    console.log('users count', usersCount);
    console.log('Next PaginationToken', PaginationToken);
    for await (const user of Users) {
      const username = user.Username;
      const userStatus = user.UserStatus;
      const enabled = user.Enabled;
      const mfaOptions = user.MFAOptions as any;
      const sub = user.Attributes.find(attr => attr.Name == 'sub')?.Value;
      const email = user.Attributes.find(attr => attr.Name == 'email')?.Value;
      const email_verified = user.Attributes.find(
        attr => attr.Name == 'email_verified',
      )?.Value;
      const phone_number = user.Attributes.find(
        attr => attr.Name == 'phone_number',
      )?.Value;
      const phone_number_verified = user.Attributes.find(
        attr => attr.Name == 'phone_number_verified',
      )?.Value;
      const userToSaveInDb = await this.userModel.create({
        _id: sub,
        sub: sub,
        username: username,
        email: email,
        email_verified: email_verified == 'true',
        phone_number: phone_number,
        user_status: userStatus,
        enabled: enabled,
        mfa_options: mfaOptions,
        phone_number_verified: phone_number_verified == 'true',
      });
      //Insert or update the user in our database
      const userFromDb = await this.userModel.findOneAndUpdate(
        {
          _id: userToSaveInDb.sub,
        },
        userToSaveInDb,
        { upsert: true, new: true },
      );
      //Get users groups from cognito
      const userGroups = await this.adminListGroupsForUser(username);
      if (
        !userGroups.groupNames.includes(Roles.PORTAL_USER) &&
        !userGroups.groupNames.includes(Roles.WPMS_USER)
      ) {
        //If user doesnot have any Roles or Groups like Poraluser or WpmsUser just add Portal user as default role
        userGroups.groupNames = [...userGroups.groupNames, Roles.PORTAL_USER];
      }
      console.log('userGroups.groupNames', userGroups.groupNames);
      //Verify user roles are present in our database
      const userGroupsToDbGroups = await this.groupService.groupModel.find({
        name: { $in: userGroups.groupNames },
      });
      console.log('userGroupsToDbGroups', userGroupsToDbGroups);
      //Finally add user to groups
      await this.userGroupService.addUserToGroups(
        userFromDb,
        userGroupsToDbGroups,
      );
    }
    if (!PaginationToken) {
      console.log('Finishaed Get Users, Total Users are', usersCount);
      return;
    } else {
      await this.syncUsersFromCognitoToMongooDb(
        limit,
        PaginationToken,
        itritation + 1,
        usersCount,
      );
    }
  }

  async listUsers(queryDto: ParsedQueryDto): Promise<MongoosePaginateUserDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    const userAggregate = this.userModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate group from its relational table
          from: 'Partner',
          localField: 'partner',
          foreignField: '_id',
          as: 'partner',
        },
      },
      { $addFields: { partner: { $first: '$partner' } } },
      {
        $lookup: {
          //populate group from its relational table
          from: 'Partner',
          localField: 'adminPartner',
          foreignField: '_id',
          as: 'adminPartner',
        },
      },
      { $addFields: { adminPartner: { $first: '$adminPartner' } } },
      {
        $lookup: {
          //populate company from its relational table
          from: 'Company',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $addFields: { company: { $first: '$company' } } },
      {
        $lookup: {
          //populate company from its relational table
          from: 'Company',
          localField: 'adminCompany',
          foreignField: '_id',
          as: 'adminCompany',
        },
      },
      { $addFields: { adminCompany: { $first: '$adminCompany' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ]);

    return this.userModel['aggregatePaginate'](userAggregate, paginateOptions);
  }

  async getCognitoUser(usernameOrSub: string) {
    var user: UserType;
    if (isValidUUID(usernameOrSub)) {
      const users = await this.cognitoIdentityServiceProvider
        .listUsers({
          UserPoolId: this.cognitoUserPoolId,
          Filter: `sub=\"${usernameOrSub}\"`,
        })
        .promise();
      user = users?.Users?.[0];
    } else {
      const adminGetUser = await this.cognitoIdentityServiceProvider
        .adminGetUser({
          UserPoolId: this.cognitoUserPoolId,
          Username: usernameOrSub,
        })
        .promise();
      user = adminGetUser;
      user.Attributes = adminGetUser.UserAttributes;
    }
    return user;
  }

  async getCognitoUserFromSub(sub: string) {
    const users = await this.cognitoIdentityServiceProvider
      .listUsers({
        UserPoolId: this.cognitoUserPoolId,
        Filter: `sub=\"${sub}\"`,
      })
      .promise();

    const targetUser = users?.Users?.[0];
    if (!targetUser) {
      return null;
    }
    return {
      username: targetUser.Username,
      user: targetUser,
    };
  }

  async updateUserWithCustomField(
    username: string,
    updateUserAttributes: [{ Name: string; Value: any }],
  ) {
    const params = {
      UserAttributes: [...updateUserAttributes],
      UserPoolId: this.cognitoUserPoolId,
      Username: username,
    };

    return new Promise((resolve, reject) => {
      this.cognitoIdentityServiceProvider.adminUpdateUserAttributes(
        params,
        function(err, data) {
          if (err) {
            reject(err);
          }
          resolve(data);
        },
      );
    });
  }

  async adminDisableUser(username: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: username,
    };

    return this.cognitoIdentityServiceProvider.adminDisableUser(params).promise();
  }

  async adminEnableUser(username: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: username,
    };

    return this.cognitoIdentityServiceProvider.adminEnableUser(params).promise();
  }

  /**
   * Create cognito user to also save user to our database
   * @param cognitoCreateUserDTO
   * @returns
   */
  async cognitoCreateUser(cognitoCreateUserDTO: CognitoCreateUserDTO) {
    var {
      userName,
      email,
      group,
      company,
      password,
      phoneNumber = '',
      isEmailVerified = false,
      isPhoneNumberVerified = false,
      sendInvitationByEmail = false,
    } = cognitoCreateUserDTO;
    var registerNewUserParams = {
      UserPoolId: this.cognitoUserPoolId,
      Username: userName,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: isEmailVerified?.toString?.(),
        },
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
        {
          Name: 'phone_number_verified',
          Value: isPhoneNumberVerified?.toString?.(),
        },
      ],
    };
    if (sendInvitationByEmail) {
      registerNewUserParams['DesiredDeliveryMediums'] = ['EMAIL'];
    } else {
      registerNewUserParams['MessageAction'] = 'SUPPRESS';
    }
    const cognitoUserCreated = await this.cognitoIdentityServiceProvider
      .adminCreateUser(registerNewUserParams)
      .promise();
    // Once user created in cognito save it to our database too
    userName = cognitoUserCreated.User.Username;
    var userDb = await this.syncUserFromCognitoToMongooDb(userName);
    const groupDb = await this.groupService.findById(group);
    var license: LicenseKey;
    if (groupDb) {
      await this.adminAddUserToGroup(userName, groupDb.name).catch(err => {
        console.warn('Warning: error adding user to group in cognito', err);
      });
      // Once We add user to cognito group, also add it to our db group too
      userDb = await this.userGroupService.addUserToGroup(userDb, groupDb);
    }
    if (company) {
      const companyDb = await this.companyService.findById(company);
      await this.adminAddUserToGroup(userName, `COM_${companyDb.name}`).catch(
        err => {
          console.warn(
            'Warning: error adding user to group company in cognito',
            err,
          );
        },
      );
      // Once We add user to cognito group company, also add it to our db company too
      userDb = await this.userCompanyService.addUserToCompany(
        userDb,
        companyDb,
      );
    }
    if (groupDb?.name !== Roles.WPMS_USER) {
      license = await this.addDefaultLicenseToUser(userName);
    }
    return {
      cognitoUserCreated: cognitoUserCreated,
      userDb: userDb,
      license: license,
    };
  }

  /**
   * Create cognito user
   * @param createUserInCognitoDto
   * @returns
   */
  async createUserInCognito(
    createUserInCognitoDto: CreateUserDto,
    saveInDb: boolean = true,
    additionalUserData: AnyObject | AnyKeys<UserDB> = null,
  ) {
    var {
      userName,
      email,
      password,
      phoneNumber = '',
      isEmailVerified = false,
      isPhoneNumberVerified = false,
      sendInvitationByEmail = false,
      ...userPayload
    } = createUserInCognitoDto;
    var registerNewUserParams = {
      UserPoolId: this.cognitoUserPoolId,
      Username: userName,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: isEmailVerified?.toString?.(),
        },
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
        {
          Name: 'phone_number_verified',
          Value: isPhoneNumberVerified?.toString?.(),
        },
      ],
    };
    if (sendInvitationByEmail) {
      registerNewUserParams['DesiredDeliveryMediums'] = ['EMAIL'];
    } else {
      registerNewUserParams['MessageAction'] = 'SUPPRESS';
    }
    const cognitoUserCreated = await this.cognitoIdentityServiceProvider
      .adminCreateUser(registerNewUserParams)
      .promise();
    //Once user created in cognito save it to our database too
    var userDb: UserDB;
    if (saveInDb) {
      try {
        const enabled = cognitoUserCreated.User.Enabled;
        const userStatus = cognitoUserCreated.User.UserStatus;
        const mfaOptions = cognitoUserCreated.User.MFAOptions as any[];
        const sub = cognitoUserCreated.User.Attributes.find(
          attr => attr.Name == 'sub',
        )?.Value;
        const email_verified = cognitoUserCreated.User.Attributes.find(
          attr => attr.Name == 'email_verified',
        )?.Value;
        const phone_number_verified = cognitoUserCreated.User.Attributes.find(
          attr => attr.Name == 'phone_number_verified',
        )?.Value;
        const userToSaveInDb = await this.userModel.create({
          _id: sub,
          sub: sub,
          username: cognitoUserCreated.User.Username,
          email: email,
          email_verified: email_verified == 'true',
          phone_number: phoneNumber,
          phone_number_verified: phone_number_verified == 'true',
          user_status: userStatus,
          enabled: enabled,
          mfa_options: mfaOptions,
          ...userPayload,
          ...additionalUserData,
        });
        userDb = await userToSaveInDb.save();
      } catch (error) {
        await this.adminDeleteUser(cognitoUserCreated.User.Username);
        return Promise.reject(error);
      }
    }

    return { cognitoUser: cognitoUserCreated, userDb: userDb };
  }

  async createOrUpdateUserInDbFromCognitoUser(
    cognitoUser: CognitoIdentityServiceProvider.UserType,
    additionalUserData?: AnyObject | AnyKeys<UserDB>,
  ) {
    const enabled = cognitoUser.Enabled;
    const userStatus = cognitoUser.UserStatus;
    const userName = cognitoUser.Username;
    const mfaOptions = cognitoUser.MFAOptions as any[];
    const sub = cognitoUser.Attributes.find(attr => attr.Name == 'sub')?.Value;
    const email = cognitoUser.Attributes.find(attr => attr.Name == 'email')
      ?.Value;
    const phoneNumber = cognitoUser.Attributes.find(
      attr => attr.Name == 'phone_number',
    )?.Value;
    const email_verified = cognitoUser.Attributes.find(
      attr => attr.Name == 'email_verified',
    )?.Value;
    const phone_number_verified = cognitoUser.Attributes.find(
      attr => attr.Name == 'phone_number_verified',
    )?.Value;
    const userToSaveInDb = await this.userModel.findOneAndUpdate(
      {
        _id: sub,
        sub: sub,
        username: userName,
      },
      {
        _id: sub,
        sub: sub,
        username: userName,
        email: email,
        email_verified: email_verified == 'true',
        phone_number: phoneNumber,
        phone_number_verified: phone_number_verified == 'true',
        user_status: userStatus,
        enabled: enabled,
        mfa_options: mfaOptions,
        ...additionalUserData,
      },
      {
        upsert: true,
        new: true,
      },
    );
    const userDb = await userToSaveInDb.save();
    return {
      cognitoUser: cognitoUser,
      userDb: userDb,
    };
  }
  async createOrUpdateUserInDbFromCognitoUserName(
    cognitoUserNameOrSub: string,
    additionalUserData?: AnyObject | AnyKeys<UserDB>,
  ) {
    const cognitoUser = await this.getCognitoUser(cognitoUserNameOrSub);
    const enabled = cognitoUser.Enabled;
    const userStatus = cognitoUser.UserStatus;
    const userName = cognitoUser.Username;
    const mfaOptions = cognitoUser.MFAOptions as any[];
    const sub = cognitoUser.Attributes.find(attr => attr.Name == 'sub')?.Value;
    const email = cognitoUser.Attributes.find(attr => attr.Name == 'email')
      ?.Value;
    const phoneNumber = cognitoUser.Attributes.find(
      attr => attr.Name == 'phone_number',
    )?.Value;
    const email_verified = cognitoUser.Attributes.find(
      attr => attr.Name == 'email_verified',
    )?.Value;
    const phone_number_verified = cognitoUser.Attributes.find(
      attr => attr.Name == 'phone_number_verified',
    )?.Value;
    const userToSaveInDb = await this.userModel.findOneAndUpdate(
      {
        _id: sub,
        sub: sub,
        username: userName,
      },
      {
        _id: sub,
        sub: sub,
        username: userName,
        email: email,
        email_verified: email_verified == 'true',
        phone_number: phoneNumber,
        phone_number_verified: phone_number_verified == 'true',
        user_status: userStatus,
        enabled: enabled,
        mfa_options: mfaOptions,
        ...additionalUserData,
      },
      {
        upsert: true,
        new: true,
      },
    );
    const userDb = await userToSaveInDb.save();
    return {
      cognitoUser: cognitoUser,
      userDb: userDb,
    };
  }

  /**
   * Create wpms user and also save user to cognito AWS
   * @param wpmsUserRegisterDTO
   * @returns
   */
  async registerAsWpmsUser(
    wpmsUserRegisterDTO: WpmsUserRegisterDTO,
    sendInvitationByEmail = false,
  ) {
    var {
      userName,
      email,
      password,
      phoneNumber = '',
      country,
      name,
    } = wpmsUserRegisterDTO;
    var registerNewUserParams = {
      UserPoolId: this.cognitoUserPoolId,
      Username: userName,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
      ],
    };
    if (sendInvitationByEmail) {
      registerNewUserParams['DesiredDeliveryMediums'] = ['EMAIL'];
    } else {
      registerNewUserParams['MessageAction'] = 'SUPPRESS';
    }
    //Create User in cognito
    var cognitoUserCreated = await this.cognitoIdentityServiceProvider
      .adminCreateUser(registerNewUserParams)
      .promise();
    const username = cognitoUserCreated.User.Username;
    //Make password as permanent(Confirmed) otherwise it will be in FORCE_CHANGE_PASSWORD
    await this.adminSetUserPassword(username, password);
    const cognitoUserAfterMakingPasswordParmanent = await this.getCognitoUser(
      username,
    );
    //Once user created in cognito save it to our database too
    const enabled = cognitoUserAfterMakingPasswordParmanent.Enabled;
    const userStatus = cognitoUserAfterMakingPasswordParmanent.UserStatus;
    const mfaOptions = cognitoUserAfterMakingPasswordParmanent.MFAOptions as any[];
    const sub = cognitoUserAfterMakingPasswordParmanent.Attributes.find(
      attr => attr.Name == 'sub',
    )?.Value;
    const email_verified = cognitoUserAfterMakingPasswordParmanent.Attributes.find(
      attr => attr.Name == 'email_verified',
    )?.Value;
    const phone_number_verified = cognitoUserAfterMakingPasswordParmanent.Attributes.find(
      attr => attr.Name == 'phone_number_verified',
    )?.Value;
    const userToSaveInDb = await this.userModel.create({
      _id: sub,
      sub: sub,
      name: name,
      username: username,
      email: email,
      email_verified: email_verified == 'true',
      phone_number: phoneNumber,
      phone_number_verified: phone_number_verified == 'true',
      user_status: userStatus,
      country: country,
      enabled: enabled,
      mfa_options: mfaOptions,
    });
    var userDb = await userToSaveInDb.save();
    //Add WPMS Role/Group to user
    const wpmsGroupDb = await this.groupService.findOne({
      name: Roles.WPMS_USER,
    });
    if (wpmsGroupDb) {
      await this.adminAddUserToGroup(userName, wpmsGroupDb.name).catch(err => {
        console.warn('Warning: error adding user to group in cognito', err);
      });
      // Once We add user to cognito group, also add it to our db group too
      userDb = await this.userGroupService.addUserToGroup(userDb, wpmsGroupDb);
    }
    return {
      cognitoUserCreated: cognitoUserAfterMakingPasswordParmanent,
      userDb: userDb,
    };
  }

  /**
   * Create wpms user and also save user to cognito AWS
   * @param wpmsUserRegisterDTO
   * @returns
   */
  async signupAsWpmsUser(
    wpmsUserRegisterDTO: WpmsUserRegisterDTO,
    sendInvitationByEmail = false,
  ) {
    var {
      userName,
      email,
      password,
      phoneNumber = '',
      country,
      name,
    } = wpmsUserRegisterDTO;
    var registerNewUserParams = {
      ClientId: this.clientId, //Client Id
      Username: userName,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
      ],
    };
    //Create User in cognito
    var cognitoUserCreated = await this.cognitoIdentityServiceProvider
      .signUp(registerNewUserParams)
      .promise();
    const cognitoUserAfterMakingPasswordParmanent = await this.getCognitoUser(
      cognitoUserCreated.UserSub,
    );
    const username = cognitoUserAfterMakingPasswordParmanent.Username;
    //Once user created in cognito save it to our database too
    const enabled = cognitoUserAfterMakingPasswordParmanent.Enabled;
    const userStatus = cognitoUserAfterMakingPasswordParmanent.UserStatus;
    const mfaOptions = cognitoUserAfterMakingPasswordParmanent.MFAOptions as any[];
    const sub = cognitoUserAfterMakingPasswordParmanent.Attributes.find(
      attr => attr.Name == 'sub',
    )?.Value;
    const email_verified = cognitoUserAfterMakingPasswordParmanent.Attributes.find(
      attr => attr.Name == 'email_verified',
    )?.Value;
    const phone_number_verified = cognitoUserAfterMakingPasswordParmanent.Attributes.find(
      attr => attr.Name == 'phone_number_verified',
    )?.Value;
    const userToSaveInDb = await this.userModel.create({
      _id: sub,
      sub: sub,
      name: name,
      username: username,
      email: email,
      email_verified: email_verified == 'true',
      phone_number: phoneNumber,
      phone_number_verified: phone_number_verified == 'true',
      user_status: userStatus,
      country: country,
      enabled: enabled,
      mfa_options: mfaOptions,
    });
    var userDb = await userToSaveInDb.save();
    //Add WPMS Role/Group to user
    const wpmsGroupDb = await this.groupService.findOne({
      name: Roles.WPMS_USER,
    });
    if (wpmsGroupDb) {
      await this.adminAddUserToGroup(userName, wpmsGroupDb.name).catch(err => {
        console.warn('Warning: error adding user to group in cognito', err);
      });
      // Once We add user to cognito group, also add it to our db group too
      userDb = await this.userGroupService.addUserToGroup(userDb, wpmsGroupDb);
    }
    return {
      cognitoUserCreated: cognitoUserAfterMakingPasswordParmanent,
      userDb: userDb,
      cognitoUserSignuped: cognitoUserCreated,
    };
  }


  async addDefaultLicenseToUser(ownerIdOrUsername: string) {
    const defaultLicense = await this.licensekeyService.createDefaultLicenseToAssignUser();
    return this.addNewLicense(defaultLicense.key, ownerIdOrUsername);
  }

  async create(createUserDto: AnyObject | AnyKeys<UserDB>) {
    const newUser = await this.userModel.create(createUserDto);
    return newUser.save();
  }

  async findAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateUserDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    const userAggregate = this.userModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate group from its relational table
          from: 'Partner',
          localField: 'partner',
          foreignField: '_id',
          as: 'partner',
        },
      },
      { $addFields: { partner: { $first: '$partner' } } },
      {
        $lookup: {
          //populate group from its relational table
          from: 'Partner',
          localField: 'adminPartner',
          foreignField: '_id',
          as: 'adminPartner',
        },
      },
      { $addFields: { adminPartner: { $first: '$adminPartner' } } },
      {
        $lookup: {
          //populate company from its relational table
          from: 'Company',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $addFields: { company: { $first: '$company' } } },
      {
        $lookup: {
          //populate company from its relational table
          from: 'Company',
          localField: 'adminCompany',
          foreignField: '_id',
          as: 'adminCompany',
        },
      },
      { $addFields: { adminCompany: { $first: '$adminCompany' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ]);

    return this.userModel['aggregatePaginate'](userAggregate, paginateOptions);
  }

  async findOneAggregate(queryDto: ParsedQueryDto) {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
   const datas = await this.userModel.aggregate<UserDB>([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate group from its relational table
          from: 'Partner',
          localField: 'partner',
          foreignField: '_id',
          as: 'partner',
        },
      },
      { $addFields: { partner: { $first: '$partner' } } },
      {
        $lookup: {
          //populate group from its relational table
          from: 'Partner',
          localField: 'adminPartner',
          foreignField: '_id',
          as: 'adminPartner',
        },
      },
      { $addFields: { adminPartner: { $first: '$adminPartner' } } },
      {
        $lookup: {
          //populate company from its relational table
          from: 'Company',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $addFields: { company: { $first: '$company' } } },
      {
        $lookup: {
          //populate company from its relational table
          from: 'Company',
          localField: 'adminCompany',
          foreignField: '_id',
          as: 'adminCompany',
        },
      },
      { $addFields: { adminCompany: { $first: '$adminCompany' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
      {
        $limit:1
      }
    ])
    return datas[0]
  }
  async findOne(filter: FilterQuery<UserDB>) {
    return this.userModel.findOne(filter)
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username: username });
  }

  update(id: string, updateUserDto: UpdateQuery<UserDB>) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto,{new:true});
  }

  removeById(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.userModel.find(filter || {}).count();
  }

  async getEstimateCount() {
    return this.userModel.estimatedDocumentCount();
  }
}
