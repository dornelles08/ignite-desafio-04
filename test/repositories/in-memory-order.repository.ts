import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { OrderRepository } from "@/domain/application/repositories/order.repository";
import { Order } from "@/domain/enterprise/entities/order";
import { OrderDetails } from "@/domain/enterprise/entities/value-onjects/order-details";
import { InMemoryPhotoRepository } from "./in-memory-photo.repository";
import { InMemoryRecipientRepository } from "./in-memory-recipient.repository";

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];

  constructor(
    private photoRepository: InMemoryPhotoRepository,
    private recipientRepository: InMemoryRecipientRepository
  ) {}

  async create(order: Order): Promise<void> {
    this.items.push(order);

    DomainEvents.dispatchEventsForAggregate(order.id);
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

  async findByDeliverierId(deliverierId: string, { page }: PaginationParams): Promise<Order[]> {
    const order = this.items
      .filter((item) => item.deliverierId === deliverierId)
      .slice((page - 1) * 20, page * 20);

    return order;
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items[itemIndex] = order;

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async findManyByDeliverierIdWithDetails(
    deliverierId: string,
    { page }: PaginationParams
  ): Promise<OrderDetails[]> {
    const orders = this.items
      .filter((item) => item.deliverierId === deliverierId)
      .slice((page - 1) * 20, page * 20);

    const ordersDetails = orders.map((order) => {
      const photo = this.photoRepository.items.find((photo) => photo.orderId === order.id);
      const recipient = this.recipientRepository.items.find(
        (recipient) => recipient.id === order.recipientId
      );

      return OrderDetails.create({
        orderId: order.id,
        status: order.status,
        url: photo?.url,
        name: recipient!.name,
        phone: recipient!.phone,
        street: recipient!.street,
        number: recipient!.number,
        complement: recipient!.complement,
        city: recipient!.city,
        state: recipient!.state,
        zipCode: recipient!.zipCode,
        district: recipient!.district,
        deliverierId: order.deliverierId!,
        recipientId: order.recipientId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    });

    return ordersDetails;
  }
}
