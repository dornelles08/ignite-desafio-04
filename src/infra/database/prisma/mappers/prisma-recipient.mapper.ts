import { Recipient } from "@/domain/enterprise/entities/recipient";
import { Prisma, Recipient as PrismaRecipient } from "@prisma/client";

export class PrismaRecipientMapper {
  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id,
      name: recipient.name,
      cpf: recipient.cpf,
      city: recipient.city,
      district: recipient.district,
      number: recipient.number,
      phone: recipient.phone,
      state: recipient.state,
      street: recipient.street,
      zipCode: recipient.zipCode,
      complement: recipient.complement,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    };
  }

  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        city: raw.city,
        district: raw.district,
        number: raw.number,
        phone: raw.phone,
        state: raw.state,
        street: raw.street,
        zipCode: raw.zipCode,
        complement: raw.complement,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id
    );
  }
}
