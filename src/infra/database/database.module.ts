import { RecipientRepository } from "@/domain/application/repositories/recipient.repository";
import { UserRepository } from "@/domain/application/repositories/users.repository";
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaRecipientRepository } from "./prisma/repositories/prisma-recipient.repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user.repository";

@Module({
  providers: [
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: RecipientRepository, useClass: PrismaRecipientRepository },
  ],
  exports: [PrismaService, UserRepository, RecipientRepository],
})
export class DatabaseModule {}
