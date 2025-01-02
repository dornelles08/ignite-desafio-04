import { OrderRepository } from "@/domain/application/repositories/order.repository";
import { Order } from "@/domain/enterprise/entities/order";

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async findByRecipientId(recipientId: string): Promise<Order[]> {
    const order = this.items.filter((item) => item.recipientId === recipientId);

    return order;
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);
    this.items[itemIndex] = order;
  }
}
