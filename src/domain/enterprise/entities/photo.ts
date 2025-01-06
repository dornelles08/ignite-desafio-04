import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";

interface PhotoProps {
  orderId: string;
  url: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Photo extends Entity<PhotoProps> {
  static create(props: Optional<PhotoProps, "createdAt">, id?: string) {
    const photo = new Photo(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
    return photo;
  }

  get orderId() {
    return this.props.orderId;
  }
  get url() {
    return this.props.url;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get title() {
    return this.props.title;
  }
}
