import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
import { LKOwner } from '../licensekey/schemas/licensekey.schema';
import { isValidUUID } from '../../shared/utils/index';
import {
  AdminGetUserResponse,
  UserType,
  AttributeType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { UserProfile, UserAttributesObj } from './schemas/user.schema';
import { AdminCreateUserDTO } from './dtos';
import { MonitorGroupsEnum } from 'src/constants/Enums';
import { RadiomonitorModule } from '../radiomonitor/radiomonitor.module';
import { RadioMonitorService } from '../radiomonitor/radiomonitor.service';

@Injectable()
export class UserService {
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  private cognitoUserPoolId: string;
  constructor(
    @Inject(forwardRef(() => LicensekeyService))
    private readonly licensekeyService: LicensekeyService,
    private readonly globalAwsService: GlobalAwsService,
    private readonly configService: ConfigService,
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
    newLKOwner.ownerId = user.userAttributeObj.sub;
    newLKOwner.username = user.username;
    newLKOwner.email = user.userAttributeObj.email;
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
      newLKOwner.ownerId = user.userAttributeObj.sub;
      newLKOwner.username = user.username;
      newLKOwner.email = user.userAttributeObj.email;
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
  async getUserProfile(
    usernameOrSub: string,
    includeGroups: boolean = false,
  ): Promise<UserProfile> {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: usernameOrSub,
    };
    if (isValidUUID(usernameOrSub)) {
      const userDetails = await this.getUserFromSub(usernameOrSub);
      if (!userDetails) {
        return Promise.resolve(null);
      }
      params.Username = userDetails.username;
    }
    const profile = await this.cognitoIdentityServiceProvider
      .adminGetUser(params)
      .promise();

    if (!profile) {
      return Promise.resolve(null);
    }
    const userAttributeObj = this.convertUserAttributesToObj(
      profile.UserAttributes,
    );

    const finalProfile = new UserProfile({
      username: profile.Username,
      sub: userAttributeObj.sub,
      userAttributes: profile.UserAttributes,
      userAttributeObj: userAttributeObj,
      enabled: profile.Enabled,
      userStatus: profile.UserStatus,
    });

    if (includeGroups) {
      const groupsResult = await this.adminListGroupsForUser(params.Username);
      finalProfile.groups = groupsResult.groupNames;
    }

    return finalProfile;
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
      const { username } = await this.getUserFromSub(usernameOrSub);
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

  /**
   * @param groupName
   */
  async getGroup(groupName: string) {
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
      const { username } = await this.getUserFromSub(usernameOrSub);
      params.Username = username;
    }
    const group = await this.cognitoIdentityServiceProvider
      .adminAddUserToGroup(params)
      .promise();

    return group;
  }

  async adminDeleteUser(usernameOrSub: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: usernameOrSub,
    };
    if (isValidUUID(usernameOrSub)) {
      const { username } = await this.getUserFromSub(usernameOrSub);
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

  async exportFromLic() {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
    };
    this.cognitoIdentityServiceProvider.listUsers(params, (err, data) => {
      console.log('users', data);
      console.log('users count', data.Users.length);
      for (let index = 0; index < data.Users.length; index++) {
        const user = data.Users[index];
        const licencesInString = user.Attributes.find(
          attr => attr.Name == 'custom:licenseKey',
        )?.Value;
        if (licencesInString) {
          const licenceIds = JSON.parse(licencesInString);
          const ownerId = user.Attributes.find(att => att.Name == 'sub').Value;
          // console.log("ownerId",ownerId);
          console.log(
            `licences for user ${user.Username} id ${ownerId}`,
            licenceIds,
          );
        }
      }
    });
  }

  async getUserFromSub(sub: string) {
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

  async adminCreateUser(adminCreateUserDTO: AdminCreateUserDTO) {
    const {
      userName,
      email,
      group,
      password,
      phoneNumber,
      isEmailVerified,
      isPhoneNumberVerified,
      sendInvitationByEmail,
    } = adminCreateUserDTO;
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
    if(sendInvitationByEmail){
      registerNewUserParams["DesiredDeliveryMediums"]=['EMAIL']
    }else{
      registerNewUserParams["MessageAction"]="SUPPRESS"
    }
    const userCreated = await this.cognitoIdentityServiceProvider
      .adminCreateUser(registerNewUserParams)
      .promise();
    if (group) {
      await this.adminAddUserToGroup(userCreated.User.Username, group).catch(
        async err => {
          await this.adminDeleteUser(userCreated.User.Username);
          throw err;
        },
      );
      // if (group == MonitorGroupsEnum.AIM || group == MonitorGroupsEnum.AFEM) {

        // await this.radioMonitorService.addUserFromHisMonitoringGroupToSubscribeRadioMonitoring(userCreated.User.Username,unlimitedLicense.key)
        // .catch(async err => {
        //   await this.adminDeleteUser(userCreated.User.Username);
        //   throw err;
        // });

      // }
    }
    const defaultLicense = await this.addDefaultLicenseToUser(
      userCreated.User.Username,
    ).catch(async err => {
      await this.adminDeleteUser(userCreated.User.Username);
      throw err;
    });
    return userCreated;
  }

  async addMonitoringSubscriptionFromMonitoringGroup(usernameOrSub:string){
    return this.radioMonitorService.addUserFromHisMonitoringGroupToSubscribeRadioMonitoring(usernameOrSub)
  }

  async addDefaultLicenseToUser(ownerIdOrUsername: string) {
    const defaultLicense = await this.licensekeyService.findOrCreateDefaultLicenseToAssignUser();
    return this.addNewLicense(defaultLicense.key, ownerIdOrUsername);
  }
}
