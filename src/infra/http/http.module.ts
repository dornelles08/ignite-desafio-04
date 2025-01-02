import { AuthenticateUserUseCase } from "@/domain/application/useCases/authenticate-user";
import { CreateOrderUseCase } from "@/domain/application/useCases/create-order";
import { CreateRecipientUseCase } from "@/domain/application/useCases/create-recipient";
import { RegisterDeliverierUseCase } from "@/domain/application/useCases/register-deliverier";
import { ResetUserPasswordUseCase } from "@/domain/application/useCases/reset-user-password";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryprography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateUserController } from "./controllers/authenticate-user.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateOrderController } from "./controllers/create-order.controller";
import { CreateRecipientController } from "./controllers/create-recipient.controller";
import { ResetUserPasswordController } from "./controllers/reset-user-password.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    CreateRecipientController,
    CreateOrderController,
    ResetUserPasswordController,
  ],
  providers: [
    RegisterDeliverierUseCase,
    AuthenticateUserUseCase,
    CreateRecipientUseCase,
    CreateOrderUseCase,
    ResetUserPasswordUseCase,
  ],
})
export class HttpModule {}
