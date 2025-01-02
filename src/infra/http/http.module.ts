import { AuthenticateUserUseCase } from "@/domain/application/useCases/authenticate-user";
import { CreateOrderUseCase } from "@/domain/application/useCases/create-order";
import { CreateRecipientUseCase } from "@/domain/application/useCases/create-recipient";
import { MarkOrderAsWaitingUseCase } from "@/domain/application/useCases/mark-order-as-waiting";
import { RegisterDeliverierUseCase } from "@/domain/application/useCases/register-deliverier";
import { ResetUserPasswordUseCase } from "@/domain/application/useCases/reset-user-password";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryprography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateUserController } from "./controllers/authenticate-user.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateOrderController } from "./controllers/create-order.controller";
import { CreateRecipientController } from "./controllers/create-recipient.controller";
import { MarkOrderAsWaitingController } from "./controllers/mark-order-as-waiting.controller";
import { ResetUserPasswordController } from "./controllers/reset-user-password.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    CreateRecipientController,
    CreateOrderController,
    ResetUserPasswordController,
    MarkOrderAsWaitingController,
  ],
  providers: [
    RegisterDeliverierUseCase,
    AuthenticateUserUseCase,
    CreateRecipientUseCase,
    CreateOrderUseCase,
    ResetUserPasswordUseCase,
    MarkOrderAsWaitingUseCase,
  ],
})
export class HttpModule {}
