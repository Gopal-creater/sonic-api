import { GlobalAwsService } from '../../shared/modules/global-aws/global-aws.service';
import { AuthConfig } from './config/auth.config';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import * as lodash from 'lodash';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { UserService } from '../user/services/user.service';
import { WpmsUserRegisterDTO } from 'src/api/auth/dto/register.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  constructor(
    private readonly authConfig: AuthConfig,
    private readonly globalAwsService: GlobalAwsService,
    public readonly userService: UserService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
    this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
  }

  authenticateUser(loginDTO: LoginDto) {
    const { name, password } = loginDTO;

    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve(result);
        },
        onFailure: err => {
          reject(err);
        },
      });
    });
  }

  async signupWpmsUser(wpmsUserRegisterDTO:WpmsUserRegisterDTO,sendInvitationByEmail=false){
    return this.userService.registerAsWpmsUser(wpmsUserRegisterDTO,sendInvitationByEmail)
  }
}
