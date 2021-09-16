import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ValidatedLicense = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.validLicense[data];
    } else {
      return req.validLicense;
    }
  },
);
