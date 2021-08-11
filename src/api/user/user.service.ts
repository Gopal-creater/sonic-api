import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
import { LKOwner } from '../licensekey/schemas/licensekey.schema';
import { isValidUUID } from '../../shared/utils/index';
import { AdminGetUserResponse,UserType } from 'aws-sdk/clients/cognitoidentityserviceprovider';

@Injectable()
export class UserService {
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  private cognitoUserPoolId: string;
  constructor(
    private readonly licensekeyService: LicensekeyService,
    private readonly globalAwsService: GlobalAwsService,
    private readonly configService: ConfigService,
  ) {
    this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
    this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
  }

  //Add new existing license: Meaning just update the metadata field with ownerId
  async addNewLicense(licenseId: string, ownerId: string) {
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
    const newLKOwner = new LKOwner();
    newLKOwner.ownerId = ownerId;
    return this.licensekeyService.addOwnerToLicense(licenseId, newLKOwner);
  }

  async addBulkNewLicenses(licenseIds: [string], ownerId: string) {
    const promises = licenseIds.map(licenseId => {
      const newLKOwner = new LKOwner();
      newLKOwner.ownerId = ownerId;
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
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: usernameOrSub,
    };
    if (isValidUUID(usernameOrSub)) {
      const { username } = await this.getUserFromSub(usernameOrSub);
      params.Username = username;
    }
    const profile = await this.cognitoIdentityServiceProvider
      .adminGetUser(params)
      .promise();
    return this.addAttributesObjToProfile(profile);
  }

  /**
   * Get User profile by username or sub
   * @param usernameOrSub this can be username or sub
   */
   async getGroupsForUser(usernameOrSub: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: usernameOrSub,
    };
    if (isValidUUID(usernameOrSub)) {
      const { username } = await this.getUserFromSub(usernameOrSub);
      params.Username = username;
    }
    return this.cognitoIdentityServiceProvider
      .adminListGroupsForUser(params)
      .promise();
  }

  addAttributesObjToProfile(profile: AdminGetUserResponse) {
    var attributesObj={}
    for (let index = 0; index < profile.UserAttributes.length; index++) {
      const element = profile.UserAttributes[index];
      attributesObj[element.Name] = element.Value;
    }
    profile['UserAttributesObj'] = attributesObj;

    return profile;
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
      throw new NotFoundException();
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
}
