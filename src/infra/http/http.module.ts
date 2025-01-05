import { AuthenticateUserUseCase } from "@/domain/application/useCases/authenticate-user";
import { CreateOrderUseCase } from "@/domain/application/useCases/create-order";
import { CreateRecipientUseCase } from "@/domain/application/useCases/create-recipient";
import { FetchDeliverierOrdersUseCase } from "@/domain/application/useCases/fetch-deliverier-orders";
import { MarkOrderAsWaitingUseCase } from "@/domain/application/useCases/mark-order-as-waiting";
import { PickupOrderUseCase } from "@/domain/application/useCases/pickup-order";
import { RegisterDeliverierUseCase } from "@/domain/application/useCases/register-deliverier";
import { ResetUserPasswordUseCase } from "@/domain/application/useCases/reset-user-password";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryprography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateUserController } from "./controllers/authenticate-user.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateOrderController } from "./controllers/create-order.controller";
import { CreateRecipientController } from "./controllers/create-recipient.controller";
import { FetchDeliverierOrdersController } from "./controllers/fetch-deliverier-orders.controller";
import { MarkOrderAsWaitingController } from "./controllers/mark-order-as-waiting.controller";
import { PickupOrderController } from "./controllers/pickup-order.controller";
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
    FetchDeliverierOrdersController,
    PickupOrderController,
  ],
  providers: [
    RegisterDeliverierUseCase,
    AuthenticateUserUseCase,
    CreateRecipientUseCase,
    CreateOrderUseCase,
    ResetUserPasswordUseCase,
    MarkOrderAsWaitingUseCase,
    FetchDeliverierOrdersUseCase,
    PickupOrderUseCase,
  ],
})
export class HttpModule {}
