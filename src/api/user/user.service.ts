import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { KeygenService } from './../../shared/modules/keygen/keygen.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  private cognitoUserPoolId: string;
  constructor(
    private readonly keygenService: KeygenService,
    private readonly globalAwsService: GlobalAwsService,
    private readonly configService: ConfigService,
  ) {
    this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
    this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID');
  }

  async listAllLicensesOfOwner(ownerId: string) {
    const ownerKey =`owner${ownerId}`.replace(/-/g,'')
    const { data, errors } = await this.keygenService.getAllLicenses(
      `metadata[${ownerKey}]=${ownerId}`,
    );
    if (errors) return Promise.reject(errors);
    return data;
  }

  //Add new existing license: Meaning just update the metadata field with ownerId
  async addNewLicense(licenseId: string, ownerId: string) {
    const { data, errors } = await this.keygenService.getLicenseById(licenseId);
    if (!data) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Invalid license key',
      });
    }
    const oldMetaData = data?.attributes?.metadata || {};
    const ownerKey =`owner${ownerId}`.replace(/-/g,'')
    oldMetaData[ownerKey] = ownerId;
    const {
      data: updatedData,
      errors: errorsUpdate,
    } = await this.keygenService.updateLicense(licenseId, {
      metadata: {
        ...oldMetaData,
      },
    });
    if (errorsUpdate) return Promise.reject(errorsUpdate);
    return updatedData;
  }

  async addBulkNewLicenses(licenseIds: [string], ownerId: string) {
    const promises = licenseIds.map(licenseId =>
      this.addNewLicense(licenseId, ownerId).catch(err => ({
        promiseError: err,
        data: licenseId,
      })),
    );
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
    this.cognitoIdentityServiceProvider.listUsers(params,(err, data)=> {
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
