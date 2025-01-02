import { NotFound } from "@/domain/application/useCases/errors/NotFound";
import { ResetUserPasswordUseCase } from "@/domain/application/useCases/reset-user-password";
import { Roles } from "@/infra/auth/roles.decorator";
import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const resetUserPasswordBodySchema = z.object({
  cpf: z.string(),
  email: z.string().email(),
  password: z.string(),
});
const bodyValidationPipe = new ZodValidationPipe(resetUserPasswordBodySchema);
type ResetUserPasswordBodySchema = z.infer<typeof resetUserPasswordBodySchema>;

@Controller("/account/:deliverierId/resetPassword")
export class ResetUserPasswordController {
  constructor(private resetUserPassword: ResetUserPasswordUseCase) {}

  @Patch()
  @Roles("ADMIN")
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ResetUserPasswordBodySchema,
    @Param("deliverierId") userId: string
  ) {
    const { cpf, email, password } = body;

    const result = await this.resetUserPassword.execute({
      cpf,
      email,
      password,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case NotFound:
          throw new NotFoundException(error.message);
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
