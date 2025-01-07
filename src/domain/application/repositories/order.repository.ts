import { PaginationParams } from "@/core/repositories/pagination-params";
import { Order } from "@/domain/enterprise/entities/order";
import { OrderDetails } from "@/domain/enterprise/entities/value-onjects/order-details";

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findByRecipientId(recipientId: string): Promise<Order[]>;
  abstract findByDeliverierId(deliverierId: string, params: PaginationParams): Promise<Order[]>;
  abstract findManyByDeliverierIdWithDetails(
    deliverierId: string,
    params: PaginationParams
  ): Promise<OrderDetails[]>;
  abstract save(order: Order): Promise<void>;
}
