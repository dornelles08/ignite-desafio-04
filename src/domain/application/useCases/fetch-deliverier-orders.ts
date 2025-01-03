import { Either, right } from "@/core/either";
import { Order } from "@/domain/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../repositories/order.repository";

interface FetchDeliverierOrdersRequest {
  deliverierId: string;
  page: number;
}

type FetchDeliverierOrdersResponse = Either<
  null,
  {
    orders: Order[];
  }
>;

@Injectable()
export class FetchDeliverierOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliverierId,
    page,
  }: FetchDeliverierOrdersRequest): Promise<FetchDeliverierOrdersResponse> {
    const orders = await this.orderRepository.findByDeliverierId(deliverierId, { page });

    return right({
      orders,
    });
  }
}
