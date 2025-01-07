import { OrderDetails } from "@/domain/enterprise/entities/value-onjects/order-details";

export class OrderDetailsPresenter {
  static toHTTP(order: OrderDetails) {
    return {
      id: order.orderId,
      deliverierId: order.deliverierId,
      status: order.status,

      photoUrl: order.url,

      recipient: {
        recipientId: order.recipientId,
        name: order.name,
        phone: order.phone,
        street: order.street,
        number: order.number,
        complement: order.complement,
        district: order.district,
        city: order.city,
        state: order.state,
        zipCode: order.zipCode,
      },

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
