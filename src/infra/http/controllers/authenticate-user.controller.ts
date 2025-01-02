import { AuthenticateUserUseCase } from "@/domain/application/useCases/authenticate-user";
import { WrongCredentialsExists } from "@/domain/application/useCases/errors/WrongCredentialsExists.error";
import { Public } from "@/infra/auth/public";
import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnauthorizedException
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const authenticateUserBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

@Controller("/authenticate")
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @Public()
  async handle(
    @Body(new ZodValidationPipe(authenticateUserBodySchema)) body: AuthenticateUserBodySchema
  ) {
    const { cpf, password } = body;

    const result = await this.authenticateUser.execute({
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case WrongCredentialsExists:
          throw new UnauthorizedException(error.message);
        default:
          throw new InternalServerErrorException();
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
