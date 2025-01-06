import { DomainEvent } from "@/core/events/domain-event";
import { Order } from "@/domain/enterprise/entities/order";

export class OrderStatusUpdateEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;

  constructor(order: Order) {
    this.order = order;
    this.ocurredAt = new Date();
  }

  getAggregateId(): string {
    return this.order.id;
  }
}
