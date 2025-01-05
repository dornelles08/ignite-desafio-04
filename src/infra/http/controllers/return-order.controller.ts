import { NotAllowed } from "@/domain/application/useCases/errors/NotAllowed.error";
import { NotFound } from "@/domain/application/useCases/errors/NotFound";
import { ReturnOrderUseCase } from "@/domain/application/useCases/return-order";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Roles } from "@/infra/auth/roles.decorator";
import {
  Controller,
  ForbiddenException,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";

@Controller("/orders/:orderId/return")
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Post()
  @HttpCode(204)
  @Roles("DELIVERIER")
  async handle(@CurrentUser() user: UserPayload, @Param("orderId") orderId: string) {
    const { sub: userId } = user;

    const result = await this.returnOrder.execute({ userId, orderId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotFound:
          throw new NotFoundException();
        case NotAllowed:
          throw new ForbiddenException();
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
