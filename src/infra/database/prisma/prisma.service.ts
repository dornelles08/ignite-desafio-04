import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  //Extend a classe PrismaClient não precisando instaciar o prisma
  constructor() {
    super({
      log: ["warn", "error"],
    });
  }

  // Quando o Modulo iniciar vai se conctar no Banco
  onModuleInit() {
    return this.$connect();
  }

  // Quando o Modulo desligar vai se desconctar no Banco
  onModuleDestroy() {
    return this.$disconnect();
  }
}
