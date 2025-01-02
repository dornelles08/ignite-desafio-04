import { CpfInvalidError } from "@/domain/application/useCases/errors/CpfInvalid.error";
import { UserAlreadyExistsError } from "@/domain/application/useCases/errors/UserAlreadyExists.error";
import { RegisterDeliverierUseCase } from "@/domain/application/useCases/register-deliverier";
import { Roles } from "@/infra/auth/roles.decorator";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private registerDeliverier: RegisterDeliverierUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles("ADMIN")
  async handle(
    @Body(new ZodValidationPipe(createAccountBodySchema)) body: CreateAccountBodySchema
  ) {
    const { cpf, email, name, password } = body;

    const result = await this.registerDeliverier.execute({
      cpf,
      email,
      name,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        case CpfInvalidError:
          throw new BadRequestException(error.message);
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
