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
import { Model, FilterQuery } from 'mongoose';
import { UserDB, UserSchemaName } from '../schemas/user.db.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserGroupService } from './user-group.service';
import { UserCompanyService } from './user-company.service';
import { GroupService } from '../../group/group.service';
import { CompanyService } from '../../company/company.service';
import { Roles } from 'src/constants/Enums';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import { MongoosePaginateUserDto } from '../dtos/mongoosepaginate-user.dto';

@Injectable()
export class UserService {
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  private cognitoUserPoolId: string;
  constructor(
    @Inject(forwardRef(() => LicensekeyService))
    private readonly licensekeyService: LicensekeyService,
    private readonly globalAwsService: GlobalAwsService,
    private readonly groupService: GroupService,
    private readonly companyService: CompanyService,
    @InjectModel(UserSchemaName)
    public readonly userModel: Model<UserDB>,
    private readonly configService: ConfigService,
    private readonly userGroupService: UserGroupService,
    private readonly userCompanyService: UserCompanyService,

    @Inject(forwardRef(() => RadioMonitorService))
    private readonly radioMonitorService: RadioMonitorService,
  ) {
    this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
    this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
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

    const user = await this.getUserProfile(ownerIdOrUsername);
    if (!user) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'User not found',
      });
    }
    const newLKOwner = new LKOwner();
    newLKOwner.ownerId = user.sub;
    newLKOwner.username = user.username;
    newLKOwner.email = user.email;
    newLKOwner.name = user.username;
    return this.licensekeyService.addOwnerToLicense(licenseId, newLKOwner);
  }

  async addBulkNewLicenses(licenseIds: [string], ownerIdOrUsername: string) {
    const user = await this.getUserProfile(ownerIdOrUsername).catch(err => {
      if (err.status == 404) {
        throw new NotFoundException(err.message);
      }
      throw err;
    });

    const promises = licenseIds.map(async licenseId => {
      const newLKOwner = new LKOwner();
      newLKOwner.ownerId = user.sub;
      newLKOwner.username = user.username;
      newLKOwner.email = user.email;
      newLKOwner.name = user.username;
      return this.licensekeyService
        .addOwnerToLicense(licenseId, newLKOwner)
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
    // Get user from cognito
    const userFromCognito = await this.getCognitoUser(usernameOrSub);
    const username = userFromCognito.Username;
    const userStatus = userFromCognito.UserStatus;
    const enabled = userFromCognito.Enabled;
    const mfaOptions = userFromCognito.MFAOptions as any[];
    const sub = userFromCognito.Attributes.find(attr => attr.Name == 'sub')
      ?.Value;
    const email = userFromCognito.Attributes.find(attr => attr.Name == 'email')
      ?.Value;
    const email_verified = userFromCognito.Attributes.find(
      attr => attr.Name == 'email_verified',
    )?.Value;
    const phone_number = userFromCognito.Attributes.find(
      attr => attr.Name == 'phone_number',
    )?.Value;
    const phone_number_verified = userFromCognito.Attributes.find(
      attr => attr.Name == 'phone_number_verified',
    )?.Value;
    const userToSaveInDb = new CreateUserDto({
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
    var userFromDb = await this.userModel.findOneAndUpdate(
      {
        _id: userToSaveInDb.sub,
      },
      userToSaveInDb,
      { upsert: true, new: true },
    );

    //Get users groups from cognito
    var userGroups = await this.adminListGroupsForUser(username);
    if (
      !userGroups.groupNames.includes(Roles.PORTAL_USER) &&
      !userGroups.groupNames.includes(Roles.WPMS_USER)
    ) {
      //If user doesnot have any Roles or Groups like Poraluser or WpmsUser just add Portal user as default role
      userGroups.groupNames = [...userGroups.groupNames, Roles.PORTAL_USER];
    }
    //Verify user roles are present in our database
    const userGroupsToDbGroups = await this.groupService.groupModel.find({
      name: { $in: userGroups.groupNames },
    });
    //Finally add user to groups
    userFromDb = await this.userGroupService.addUserToGroups(
      userFromDb,
      userGroupsToDbGroups,
    );
    return userFromDb;
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
      const userToSaveInDb = new CreateUserDto({
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
      //Verify user roles are present in our database
      const userGroupsToDbGroups = await this.groupService.groupModel.find({
        name: { $in: userGroups.groupNames },
      });
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
          //populate radioStation from its relational table
          from: 'Group',
          localField: 'groups',
          foreignField: '_id',
          as: 'groups',
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'Company',
          localField: 'companies',
          foreignField: '_id',
          as: 'companies',
        },
      },
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
      phoneNumber,
      isEmailVerified,
      isPhoneNumberVerified,
      sendInvitationByEmail,
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
          Value: isEmailVerified.toString(),
        },
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
        {
          Name: 'phone_number_verified',
          Value: isPhoneNumberVerified.toString(),
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
    if (group) {
      const groupDb = await this.groupService.findById(group);
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
    await this.addDefaultLicenseToUser(userName);
    return {
      cognitoUserCreated: cognitoUserCreated,
      userDb: userDb,
    };
  }

  async addMonitoringSubscriptionFromMonitoringGroup(usernameOrSub: string) {
    return this.radioMonitorService.addUserFromHisMonitoringGroupToSubscribeRadioMonitoring(
      usernameOrSub,
    );
  }

  async addDefaultLicenseToUser(ownerIdOrUsername: string) {
    const defaultLicense = await this.licensekeyService.findOrCreateDefaultLicenseToAssignUser();
    return this.addNewLicense(defaultLicense.key, ownerIdOrUsername);
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create(createUserDto);
    return newUser.save();
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(filter: FilterQuery<UserDB>) {
    return this.userModel.findOne(filter);
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
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
