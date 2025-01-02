import { Recipient, RecipientProps } from "@/domain/enterprise/entities/recipient";
import { PrismaRecipientMapper } from "@/infra/database/prisma/mappers/prisma-recipient.mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { generateCPF } from "test/helpers/generate-cpf";

export function makeRecipient(override: Partial<RecipientProps> = {}, id?: string) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      cpf: generateCPF(false),
      city: faker.location.city(),
      complement: "",
      district: faker.lorem.slug(),
      number: faker.location.buildingNumber(),
      phone: faker.phone.number(),
      state: faker.location.state(),
      street: faker.location.street(),
      zipCode: faker.location.zipCode(),
      ...override,
    },
    id
  );

  return recipient;
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: Partial<RecipientProps> = {}): Promise<Recipient> {
    const recipient = makeRecipient(data);

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });

    return recipient;
  }
}
