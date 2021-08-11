import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSession } from '../../user/schemas/user.schema';

export type targetValue = 'Query' | 'Param';
@Injectable()
export class IsTargetUserLoggedInGuard implements CanActivate {
  constructor(private target: targetValue = 'Query',private name:string="targetUser") {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    switch (this.target) {
      case 'Query':
        const query = request.query;
        if (request.user) {
          if (!query[this.name]) {
            throw new UnauthorizedException(
              `Specify target user equal to your own id. eg: ?${this.name}=yourId`,
            );
          }
          const loggedInUser = request.user as UserSession;
          const targetUser = query[this.name];
          // delete req
          if (targetUser == loggedInUser['sub']) {
            delete query.targetUser;
            request.query = query;
            return true;
          } else {
            throw new UnauthorizedException(
              'Target user is different from loggedIn User',
            );
          }
        }
        throw new UnauthorizedException('You are not loggedIn');

      case 'Param':
        const param = request.params;
        if (request.user) {
          if (!param[this.name]) {
            throw new UnauthorizedException(
              `Specify target user equal to your own id. eg: {${this.name}}=yourId`,
            );
          }
          const loggedInUser = request.user as UserSession;
          const targetUser = param[this.name];
          // delete req
          if (targetUser == loggedInUser['sub']) {
            return true;
          } else {
            throw new UnauthorizedException(
              'Target user is different from loggedIn User',
            );
          }
        }
        throw new UnauthorizedException('You are not loggedIn');
    }
  }
}
