import { NotFound } from "@/domain/application/useCases/errors/NotFound";
import { MarkOrderAsWaitingUseCase } from "@/domain/application/useCases/mark-order-as-waiting";

import { Roles } from "@/infra/auth/roles.decorator";
import {
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post
} from "@nestjs/common";

@Controller("/orders/:orderId/waiting")
export class MarkOrderAsWaitingController {
  constructor(private markOrderAsWaiting: MarkOrderAsWaitingUseCase) {}

  @Post()
  @Roles("ADMIN")
  @HttpCode(204)
  async handle(@Param("orderId") orderId: string) {
    const result = await this.markOrderAsWaiting.execute({
      orderId,
    });

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
