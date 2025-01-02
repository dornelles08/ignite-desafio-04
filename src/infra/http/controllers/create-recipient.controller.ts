import { CreateRecipientUseCase } from "@/domain/application/useCases/create-recipient";
import { Roles } from "@/infra/auth/roles.decorator";
import { Body, Controller, HttpCode, InternalServerErrorException, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  phone: z.string(),
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
@Roles("ADMIN")
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateRecipientBodySchema) {
    const { city, cpf, district, name, number, phone, state, street, zipCode, complement } = body;

    const result = await this.createRecipient.execute({
      city,
      cpf,
      district,
      name,
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

    const { recipient } = result.value;

    return {
      recipientId: recipient.id.toString(),
    };
  }
}
