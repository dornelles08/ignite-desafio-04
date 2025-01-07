import { OrderDetails } from "@/domain/enterprise/entities/value-onjects/order-details";
import {
  Order as PrismaOrder,
  Photo as PrismaPhoto,
  Recipient as PrismRecipient,
} from "@prisma/client";

type PrismaOrderDetails = PrismaOrder & {
  photos: PrismaPhoto[];
  recipient: PrismRecipient;
};

export class PrismaOrderDetailsMapper {
  static toDomain(raw: PrismaOrderDetails): OrderDetails {
    return OrderDetails.create({
      orderId: raw.id,
      status: raw.status,
      url: raw.photos[0] && raw.photos[0].url,
      name: raw.recipient.name,
      phone: raw.recipient.phone,
      street: raw.recipient.street,
      number: raw.recipient.number,
      complement: raw.recipient.complement,
      city: raw.recipient.city,
      state: raw.recipient.state,
      zipCode: raw.recipient.zipCode,
      district: raw.recipient.district,
      deliverierId: raw.deliverierId!,
      recipientId: raw.recipientId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
