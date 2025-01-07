import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { OrderRepository } from "@/domain/application/repositories/order.repository";
import { Order } from "@/domain/enterprise/entities/order";
import { OrderDetails } from "@/domain/enterprise/entities/value-onjects/order-details";
import { Injectable } from "@nestjs/common";
import { PrismaOrderDetailsMapper } from "../mappers/prisma-order-details.mapper";
import { PrismaOrderMapper } from "../mappers/prisma-order.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.create({ data });

    DomainEvents.dispatchEventsForAggregate(order.id);
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

  async findByDeliverierId(deliverierId: string, { page }: PaginationParams): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliverierId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      where: { id: order.id },
      data,
    });

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async findManyByDeliverierIdWithDetails(
    deliverierId: string,
    params: PaginationParams
  ): Promise<OrderDetails[]> {
    let orders = await this.prisma.order.findMany({
      where: {
        deliverierId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (params.page - 1) * 20,
      include: {
        photos: true,
        recipient: true,
      },
    });

    return orders.map(PrismaOrderDetailsMapper.toDomain);
  }
}
