import { Order } from "@/domain/enterprise/entities/order";
import { Prisma, Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderMapper {
  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id,
      recipientId: order.recipientId,
      deliverierId: order.deliverierId,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: raw.recipientId,
        deliverierId: raw.deliverierId,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id
    );
  }
}
