import { RecipientRepository } from "@/domain/application/repositories/recipient.repository";
import { Recipient } from "@/domain/enterprise/entities/recipient";
import { Injectable } from "@nestjs/common";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({ data });
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id },
    });

    if (!recipient) return null;

    return PrismaRecipientMapper.toDomain(recipient);
  }
}
