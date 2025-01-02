import { AuthenticateUserUseCase } from "@/domain/application/useCases/authenticate-user";
import { RegisterDeliverierUseCase } from "@/domain/application/useCases/register-deliverier";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryprography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateUserController } from "./controllers/authenticate-user.controller";
import { CreateAccountController } from "./controllers/create-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateUserController],
  providers: [RegisterDeliverierUseCase, AuthenticateUserUseCase],
})
export class HttpModule {}
