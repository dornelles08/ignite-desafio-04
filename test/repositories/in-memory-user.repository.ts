import { UserRepository } from "@/domain/application/repositories/users.repository";
import { User } from "@/domain/enterprise/entities/user";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.items.find((item) => item.cpf === cpf);

    if (!user) {
      return null;
    }

    return user;
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);
    this.items[itemIndex] = user;
  }
}
