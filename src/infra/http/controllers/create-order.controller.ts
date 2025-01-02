import { CreateOrderUseCase } from "@/domain/application/useCases/create-order";
import { RecipientNotFound } from "@/domain/application/useCases/errors/RecipientNotFound.error";
import { Roles } from "@/infra/auth/roles.decorator";
import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createOrderBodySchema = z.object({
  recipientId: z.string(),
});

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller("/orders")
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles("ADMIN")
  async handle(@Body(new ZodValidationPipe(createOrderBodySchema)) body: CreateOrderBodySchema) {
    const { recipientId } = body;

    const result = await this.createOrder.execute({
      recipientId,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case RecipientNotFound:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
