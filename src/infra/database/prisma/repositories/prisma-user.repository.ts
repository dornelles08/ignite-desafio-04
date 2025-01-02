import { UserRepository } from "@/domain/application/repositories/users.repository";
import { User } from "@/domain/enterprise/entities/user";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "../mappers/prisma-user.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
  }

  async findByCpfEmail(cpf: string, email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf, email },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByIdCpfEmail(id: string, cpf: string, email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf, email, id },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }
}
