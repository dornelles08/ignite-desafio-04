import { AuthenticateUserUseCase } from "@/domain/application/useCases/authenticate-user";
import { CreateOrderUseCase } from "@/domain/application/useCases/create-order";
import { CreateRecipientUseCase } from "@/domain/application/useCases/create-recipient";
import { RegisterDeliverierUseCase } from "@/domain/application/useCases/register-deliverier";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryprography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateUserController } from "./controllers/authenticate-user.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateOrderController } from "./controllers/create-order.controller";
import { CreateRecipientController } from "./controllers/create-recipient.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    CreateRecipientController,
    CreateOrderController,
  ],
  providers: [
    RegisterDeliverierUseCase,
    AuthenticateUserUseCase,
    CreateRecipientUseCase,
    CreateOrderUseCase,
  ],
})
export class HttpModule {}
