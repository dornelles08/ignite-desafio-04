import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserPayload } from "./jwt.strategy";

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user as UserPayload;
});
