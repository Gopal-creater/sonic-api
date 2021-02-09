import { GlobalAwsService } from 'src/shared/modules/global-aws/global-aws.service';
import { AuthConfig } from './config/auth.config';
import { Inject, Injectable } from '@nestjs/common';
import * as lodash from 'lodash';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { KeygenService } from '../../shared/modules/keygen/keygen.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  constructor(
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
    private readonly globalAwsService: GlobalAwsService,
    private readonly keygenService: KeygenService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
    this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
  }

  registerUser(registerDTO: RegisterDTO) {
    const { userName, email, password,phoneNumber } = registerDTO;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        userName,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (error, result) => {
          if (!result) {
            reject(error);
          } else {
            resolve(result.user);
          }
        },
      );
    });
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
}
