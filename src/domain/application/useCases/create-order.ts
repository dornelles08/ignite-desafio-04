import { Either, left, right } from "@/core/either";
import { Order } from "@/domain/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../repositories/order.repository";
import { RecipientRepository } from "../repositories/recipient.repository";
import { RecipientNotFoundError } from "./errors/RecipientNotFoundError";
import { UnkownError } from "./errors/UnkownError.error";

interface CreateOrderRequest {
  recipientId: string;
}

type CreateOrderResponse = Either<
  RecipientNotFoundError | UnkownError,
  {
    order: Order;
  }
>;

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository
  ) {}

  async execute({ recipientId }: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const recipientExists = await this.recipientRepository.findById(recipientId);

      if (!recipientExists) {
        return left(new RecipientNotFoundError());
      }

      const order = Order.create({
        recipientId,
      });

      await this.orderRepository.create(order);

      return right({
        order,
      });
    } catch (error) {
      return left(new UnkownError());
    }
  }
}
