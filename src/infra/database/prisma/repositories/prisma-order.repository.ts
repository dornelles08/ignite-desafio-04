import { OrderRepository } from "@/domain/application/repositories/order.repository";
import { Order } from "@/domain/enterprise/entities/order";
import { Injectable } from "@nestjs/common";
import { PrismaOrderMapper } from "../mappers/prisma-order.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.create({ data });
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) return null;

    return PrismaOrderMapper.toDomain(order);
  }

  async findByRecipientId(recipientId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        recipientId,
      },
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      where: { id: order.id },
      data,
    });
  }
}
