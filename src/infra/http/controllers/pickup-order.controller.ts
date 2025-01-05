import { NotFound } from "@/domain/application/useCases/errors/NotFound";
import { PickupOrderUseCase } from "@/domain/application/useCases/pickup-order";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { Roles } from "@/infra/auth/roles.decorator";
import {
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";

@Controller("/orders/:orderId/pickup")
export class PickupOrderController {
  constructor(private pickupOrder: PickupOrderUseCase) {}

  @Post()
  @HttpCode(204)
  @Roles("DELIVERIER")
  async handle(@CurrentUser() user: UserPayload, @Param("orderId") orderId: string) {
    const { sub: userId } = user;

    const result = await this.pickupOrder.execute({ userId, orderId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotFound:
          throw new NotFoundException();
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
