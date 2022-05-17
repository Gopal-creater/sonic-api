import { GlobalAwsService } from '../../shared/modules/global-aws/global-aws.service';
import { AuthConfig } from './config/auth.config';
import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as lodash from 'lodash';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { LoginDto } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { UserService } from '../user/services/user.service';
import { WpmsUserRegisterDTO } from 'src/api/auth/dto/register.dto';
import { PartnerService } from '../partner/services/partner.service';
import { SystemRoles } from 'src/constants/Enums';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;
  constructor(
    private readonly authConfig: AuthConfig,
    private readonly globalAwsService: GlobalAwsService,
    public readonly userService: UserService,
    private readonly partnerService: PartnerService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
    this.cognitoIdentityServiceProvider = globalAwsService.getCognitoIdentityServiceProvider();
  }

  async login(userName: string, password: string) {
    const authenticationDetails = new AuthenticationDetails({
      Username: userName,
      Password: password,
    });
    const userData = {
      Username: userName,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    const cognitoUserSession:CognitoUserSession = await  new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          resolve(result);
        },
        onFailure: err => {
          reject(err);
        },
      });
    });
    //Get user from Db
    var userDb = await this.userService.findByUsername(userName)
    //If user not found on our db, please create it in our db too
    if(!userDb){
      const userCreatedResult =await this.userService.syncUserFromCognitoToMongooDb(userName)
      userDb=userCreatedResult
    }
    return{
      cognitoUserSession:cognitoUserSession,
      user:userDb
    }
  }
  async signupWpmsUser(wpmsUserRegisterDTO: WpmsUserRegisterDTO) {
    const wpmsPartner = await this.partnerService.findOne({ name: 'WPMS' });
    if (!wpmsPartner) {
      throw new NotFoundException(
        'WPMS partner doest not exists, please ask admin to create WPMS partner first before signing up WPMS user',
      );
    }
    var {
      userName,
      email,
      password,
      phoneNumber = '',
      country,
      name,
    } = wpmsUserRegisterDTO;
    var registerNewUserParams = {
      ClientId: this.authConfig.clientId, //Client Id
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
    var cognitoUserSignedUp = await this.cognitoIdentityServiceProvider
      .signUp(registerNewUserParams)
      .promise();
    const userCreatedResponse = await this.userService.createOrUpdateUserInDbFromCognitoUserName(
      cognitoUserSignedUp.UserSub,
      {
        partner: wpmsPartner._id,
        userRole: SystemRoles.PARTNER_USER,
        country: country,
        name: name,
      },
    );
    return userCreatedResponse;
  }
}
