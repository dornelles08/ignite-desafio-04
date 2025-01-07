import { Either, right } from "@/core/either";
import { OrderDetails } from "@/domain/enterprise/entities/value-onjects/order-details";
import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../repositories/order.repository";

interface FetchDeliverierOrdersRequest {
  deliverierId: string;
  page: number;
}

type FetchDeliverierOrdersResponse = Either<
  null,
  {
    orders: OrderDetails[];
  }
>;

@Injectable()
export class FetchDeliverierOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliverierId,
    page,
  }: FetchDeliverierOrdersRequest): Promise<FetchDeliverierOrdersResponse> {
    const orders = await this.orderRepository.findManyByDeliverierIdWithDetails(deliverierId, {
      page,
    });

    return right({
      orders,
    });
  }
}
