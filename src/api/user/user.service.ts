import { ConfigService } from '@nestjs/config';
import { GlobalAwsService } from './../../shared/modules/global-aws/global-aws.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { KeygenService } from 'src/shared/modules/keygen/keygen.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  private cognitoUserPoolId:string;
  constructor(
    private readonly keygenService: KeygenService,
    private readonly globalAwsService: GlobalAwsService,
    private readonly configService: ConfigService,
  ) {
    this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
    this.cognitoUserPoolId = this.configService.get('COGNITO_USER_POOL_ID')
  }

  async listAllLicensesOfOwner(ownerId: string) {
    const {data,errors} = await this.keygenService.getAllLicenses(`metadata[ownerId]=${ownerId}`);
    if(errors) return Promise.reject(errors)
    return data
  }

  //Add new existing license: Meaning just update the metadata field with ownerId
  async addNewLicense(licenseId: string, ownerId: string) {
    const {data,errors} = await this.keygenService.getLicenseById(licenseId)
    if (!data) {
      throw new NotFoundException('Invalid license key');
    }
    if(data?.attributes?.metadata?.ownerId){
      throw new BadRequestException('This key is already used by someone');
    }
    const {data:updatedData,errors:errorsUpdate} = await this.keygenService.updateLicense(licenseId, {
      metadata: {
        ...data?.attributes?.metadata,
        ownerId: ownerId,
      },
    });
    if(errorsUpdate) return Promise.reject(errorsUpdate)
    return updatedData
  }

  async addBulkNewLicenses(licenseIds: [string], ownerId: string) {
   const promises = licenseIds.map(id=>this.addNewLicense(id,ownerId))
   return Promise.all(promises)
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

  async updateUserWithCustomField(
    username: string,
    updateUserAttributes: [{ Name: string, Value: any }],
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
