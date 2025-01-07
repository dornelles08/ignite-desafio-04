import { ValueObject } from "@/core/entities/value-object";

export interface OrderDetailsProps {
  orderId: string;
  recipientId: string;
  deliverierId: string;
  status: string;

  url?: string | null;

  name: string;
  phone: string;
  street: string;
  number: string;
  complement?: string | null;
  district: string;
  city: string;
  state: string;
  zipCode: string;

  createdAt: Date;
  updatedAt?: Date | null;
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
  static create(props: OrderDetailsProps) {
    return new OrderDetails(props);
  }

  get orderId() {
    return this.props.orderId;
  }
  get recipientId() {
    return this.props.recipientId;
  }
  get deliverierId() {
    return this.props.deliverierId;
  }
  get status() {
    return this.props;
  }

  get url() {
    return this.props.url;
  }

  get name() {
    return this.props.name;
  }
  get phone() {
    return this.props.phone;
  }
  get street() {
    return this.props.street;
  }
  get number() {
    return this.props.number;
  }
  get complement() {
    return this.props.complement;
  }
  get district() {
    return this.props.district;
  }
  get city() {
    return this.props.city;
  }
  get state() {
    return this.props.state;
  }
  get zipCode() {
    return this.props.zipCode;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
