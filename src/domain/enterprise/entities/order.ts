import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";
import { OrderStatus } from "./orderStatus";

export interface OrderProps {
  recipientId: string;
  status: OrderStatus;
  deliverierId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends Entity<OrderProps> {
  static create(props: Optional<OrderProps, "createdAt" | "status">, id?: string) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? "CREATED",
      },
      id
    );
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

  set status(status: OrderStatus) {
    this.props.status = status;
    this.touch();
  }
  private touch() {
    this.props.updatedAt = new Date();
  }
}
