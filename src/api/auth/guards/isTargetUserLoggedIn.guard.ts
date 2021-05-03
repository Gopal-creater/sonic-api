import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export type targetValue = 'Query' | 'Param';
@Injectable()
export class IsTargetUserLoggedInGuard implements CanActivate {
  constructor(private target: targetValue = 'Query') {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    switch (this.target) {
      case 'Query':
        const query = request.query;
        if (request.user) {
          if (!query.targetUser) {
            throw new UnauthorizedException(
              'Specify target user equal to your own id. eg: ?targetUser=yourId',
            );
          }
          const loggedInUser = request.user;
          const targetUser = query.targetUser;
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
          if (!param.targetUser) {
            throw new UnauthorizedException(
              'Specify target user equal to your own id. eg: {targetUser}=yourId',
            );
          }
          const loggedInUser = request.user;
          const targetUser = param.targetUser;
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
