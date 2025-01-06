import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";

export interface RecipientProps {
  name: string;
  cpf: string;
  phone: string;
  email: string;
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

export class Recipient extends Entity<RecipientProps> {
  static create(props: Optional<RecipientProps, "createdAt">, id?: string) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
    return recipient;
  }

  get name() {
    return this.props.name;
  }
  get cpf() {
    return this.props.cpf;
  }
  get phone() {
    return this.props.phone;
  }
  get email() {
    return this.props.email;
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
