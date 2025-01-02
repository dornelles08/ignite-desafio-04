import { OrderRepository } from "@/domain/application/repositories/order.repository";
import { RecipientRepository } from "@/domain/application/repositories/recipient.repository";
import { UserRepository } from "@/domain/application/repositories/users.repository";
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaOrderRepository } from "./prisma/repositories/prisma-order.repository";
import { PrismaRecipientRepository } from "./prisma/repositories/prisma-recipient.repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user.repository";

@Module({
  providers: [
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: RecipientRepository, useClass: PrismaRecipientRepository },
    { provide: OrderRepository, useClass: PrismaOrderRepository },
  ],
  exports: [PrismaService, UserRepository, RecipientRepository, OrderRepository],
})
export class DatabaseModule {}
