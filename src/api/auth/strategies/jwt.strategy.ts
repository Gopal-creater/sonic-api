import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthConfig } from '../config/auth.config';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private authConfig: AuthConfig,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,        
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: authConfig.clientId,
      issuer: authConfig.authority,
      algorithms: ['RS256'],
      passReqToCallback: true, // Arun: I need the request in callback to get authInfo and tokens.
    });
  }

  /**
 * Basic User Details
 * Arun: Passport will build a 'user' object based on the return value of our validate() 
 * method, and attach it as a property on the Request object. So we can add more business logic here.
 * {
 * sub: '5728f50d-146b-47d2-aa7b-a50bc37d641d',
 * 'cognito:groups': [ 'Admin' ],
 * email_verified: true,
 * 'cognito:preferred_role': 'arn:aws:iam::017169623383:role/service-role/SonicRole',
 * iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_16ANcIiGR',
 * phone_number_verified: true,
 * 'cognito:username': 'soniclocaldemouser1',
 * 'cognito:roles': [ 'arn:aws:iam::017169623383:role/service-role/SonicRole' ],
 * aud: '4bv6knpf3hho8jpdc4964i4c1g',
 * event_id: '8dece8cb-e27a-4b29-afc6-03b3e30b6e92',
 * token_use: 'id',
 * auth_time: 1626257267,
 * 'custom:licenseKey': '["159bb263-b265-451a-ae3d-0d789d586de7","2a52c2c2-be1b-4d95-9634-4c2f7a574665","48482dd1-ffda-4eef-9273-a044de98ad28","314d6ff9-84d9-40f7-9673-3b47911c44b3"]',
 * phone_number: '+919844265677',
 * exp: 1626260867,
 * iat: 1626257267,
 * email: 'ta.arun@gmail.com'
 * }
 */
  public async validate(request: Request, payload:any) {
    console.log("cognito user",payload)
    // var token = request.headers['authorization']?.split(" ")[1] as string
    //TODO: Only sync user if userInDb is null && cognito user updatedDate is differe from user in db cognitoUpdatedDate
    var validUser = await this.userService.syncUserFromCognitoToMongooDb(payload?.['cognito:username'])
    validUser = await this.userService.findById(payload.sub)

    return validUser;
  }
}
