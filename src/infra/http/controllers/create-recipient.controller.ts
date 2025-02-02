import { CreateRecipientUseCase } from "@/domain/application/useCases/create-recipient";
import { Roles } from "@/infra/auth/roles.decorator";
import { Body, Controller, HttpCode, InternalServerErrorException, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  phone: z.string(),
  email: z.string().email(),
  street: z.string(),
  number: z.string(),
  complement: z.string().optional(),
  district: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
});
const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema);
type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller("/recipient")
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles("ADMIN")
  async handle(@Body(bodyValidationPipe) body: CreateRecipientBodySchema) {
    const { city, cpf, district, name, email, number, phone, state, street, zipCode, complement } =
      body;

    const result = await this.createRecipient.execute({
      city,
      cpf,
      district,
      name,
      email,
      number,
      phone,
      state,
      street,
      zipCode,
      complement,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException();
    }
  }
}
