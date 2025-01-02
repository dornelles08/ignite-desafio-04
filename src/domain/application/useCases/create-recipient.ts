import { Either, right } from "@/core/either";
import { Recipient } from "@/domain/enterprise/entities/recipient";
import { RecipientRepository } from "../repositories/recipient.repository";

interface CreateRecipientRequest {
  name: string;
  cpf: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

type CreateRecipientResponse = Either<
  null,
  {
    recipient: Recipient;
  }
>;

export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    cpf,
    phone,
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  }: CreateRecipientRequest): Promise<CreateRecipientResponse> {
    const recipient = Recipient.create({
      name,
      cpf,
      phone,
      street,
      number,
      complement,
      district,
      city,
      state,
      zipCode,
    });

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
