import { Entity } from "src/core/entities/entity";
import { Optional } from "src/core/types/optional";
import { Role } from "./role";

export interface UserProsps {
  name: string;
  email: string;
  cpf: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProsps> {
  static create(props: Optional<UserProsps, "createdAt" | "role">, id?: string) {
    const user = new User(
      {
        ...props,
        role: props.role ?? "DELIVERIER",
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
    return user;
  }

  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get cpf() {
    return this.props.cpf;
  }
  get password() {
    return this.props.password;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get role() {
    return this.props.role;
  }
}
