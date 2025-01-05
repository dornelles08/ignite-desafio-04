import { Either, left, right } from "@/core/either";
import { Order } from "@/domain/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../repositories/order.repository";
import { NotFound } from "./errors/NotFound";
import { UnkownError } from "./errors/UnkownError.error";

interface PickupOrderRequest {
  orderId: string;
  userId: string;
}

type PickupOrderResponse = Either<
  NotFound | UnkownError,
  {
    order: Order;
  }
>;

@Injectable()
export class PickupOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId, userId }: PickupOrderRequest): Promise<PickupOrderResponse> {
    try {
      const order = await this.orderRepository.findById(orderId);

      if (!order) {
        return left(new NotFound("Order"));
      }

      order.deliverierId = userId;

      order.status = "PICKUP";

      await this.orderRepository.save(order);

      return right({
        order,
      });
    } catch (error) {
      return left(new UnkownError());
    }
  }
}
