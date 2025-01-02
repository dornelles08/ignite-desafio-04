import { Either, left, right } from "@/core/either";
import { Order } from "@/domain/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../repositories/order.repository";
import { NotFound } from "./errors/NotFound";
import { UnkownError } from "./errors/UnkownError.error";

interface MarkOrderAsWaitingRequest {
  orderId: string;
}

type MarkOrderAsWaitingResponse = Either<
  UnkownError | NotFound,
  {
    order: Order;
  }
>;

@Injectable()
export class MarkOrderAsWaitingUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId }: MarkOrderAsWaitingRequest): Promise<MarkOrderAsWaitingResponse> {
    try {
      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        return left(new NotFound("Order"));
      }

      order.status = "WAITING";

      await this.orderRepository.save(order);

      return right({
        order,
      });
    } catch (error) {
      return left(new UnkownError());
    }
  }
}
