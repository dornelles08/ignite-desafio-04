import { Either, left, right } from "@/core/either";
import { Order } from "@/domain/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../repositories/order.repository";
import { NotAllowed } from "./errors/NotAllowed.error";
import { NotFound } from "./errors/NotFound";
import { UnkownError } from "./errors/UnkownError.error";

interface ReturnOrderUseCaseRequest {
  orderId: string;
  userId: string;
}

type ReturnOrderUseCaseResponse = Either<NotFound | UnkownError | NotAllowed, { order: Order }>;

@Injectable()
export class ReturnOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    userId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    try {
      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        return left(new NotFound("Order"));
      }

      if (order.deliverierId !== userId || order.status !== "PICKUP") {
        return left(new NotAllowed());
      }

      order.status = "RETURNED";

      await this.orderRepository.save(order);

      return right({ order });
    } catch (error) {
      return left(new UnkownError());
    }
  }
}
