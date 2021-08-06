import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LicensekeyService } from '../licensekey/services/licensekey.service';
import { LKOwner } from '../licensekey/schemas/licensekey.schema';

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

  async getUserProfile(username: string) {
    const params = {
      UserPoolId: this.cognitoUserPoolId,
      Username: username,
    };
    return new Promise((resolve, reject) => {
      this.cognitoIdentityServiceProvider.adminGetUser(params, function(
        err,
        data,
      ) {
        if (err) {
          reject(err);
        }

        var result = {};
        for (let index = 0; index < data.UserAttributes.length; index++) {
          const element = data.UserAttributes[index];
          result[element.Name] = element.Value;
        }
        resolve(result);
      });
    });
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
