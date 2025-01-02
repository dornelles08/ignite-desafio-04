import { Either, left, right } from "@/core/either";
import { Recipient } from "@/domain/enterprise/entities/recipient";
import { Injectable } from "@nestjs/common";
import { RecipientRepository } from "../repositories/recipient.repository";
import { UnkownError } from "./errors/UnkownError.error";

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
  UnkownError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
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
    try {
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
    } catch (error) {
      console.log(error);

      return left(new UnkownError());
    }
  }
}
