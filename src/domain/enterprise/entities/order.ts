import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Optional } from "@/core/types/optional";
import { OrderStatusUpdateEvent } from "@/domain/application/events/order-status-update.event";
import { OrderStatus } from "./orderStatus";

export interface OrderProps {
  recipientId: string;
  status: OrderStatus;
  deliverierId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  static create(props: Optional<OrderProps, "createdAt" | "status">, id?: string) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? "CREATED",
      },
      id
    );

    const isNew = !id;

    if (isNew) order.addDomainEvent(new OrderStatusUpdateEvent(order));

    return order;
  }

  get recipientId() {
    return this.props.recipientId;
  }
  get status() {
    return this.props.status;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get deliverierId() {
    return this.props.deliverierId;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  set deliverierId(deliverierId: string | undefined | null) {
    this.props.deliverierId = deliverierId;
    this.touch();
  }

  set status(status: OrderStatus) {
    this.props.status = status;

    this.addDomainEvent(new OrderStatusUpdateEvent(this));

    this.touch();
  }
  private touch() {
    this.props.updatedAt = new Date();
  }
}
