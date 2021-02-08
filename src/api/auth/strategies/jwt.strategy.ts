import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthConfig } from '../config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
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

  // Arun: Passport will build a 'user' object based on the return value of our validate() 
  // method, and attach it as a property on the Request object. So we can add more business logic here.
  public async validate(request: Request, payload:any) {
    console.log('payload: ' + JSON.stringify(payload));
    var token = request.headers['authorization']?.split(" ")[1] as string
    payload.token = token
    return payload;
  }
}
