import { Order } from "@/domain/enterprise/entities/order";

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findByRecipientId(recipientId: string): Promise<Order[]>;
  abstract save(order: Order): Promise<void>;
}