import { Order } from "@/domain/enterprise/entities/order";

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id,
      recipientId: order.recipientId,
      deliverierId: order.deliverierId,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
