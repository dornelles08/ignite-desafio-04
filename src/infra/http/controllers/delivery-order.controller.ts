import { DeliveryOrderUseCase } from "@/domain/application/useCases/delivery-order";
import { NotAllowed } from "@/domain/application/useCases/errors/NotAllowed.error";
import { NotFound } from "@/domain/application/useCases/errors/NotFound";
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

@Controller("/orders/:orderId/delivery")
export class DeliveryOrderController {
  constructor(private deliveryOrder: DeliveryOrderUseCase) {}

  @Post()
  @HttpCode(204)
  @Roles("DELIVERIER")
  async handle(@CurrentUser() user: UserPayload, @Param("orderId") orderId: string) {
    const { sub: userId } = user;

    const result = await this.deliveryOrder.execute({ userId, orderId });

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
