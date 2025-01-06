import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient.repository";
import { CreateRecipientUseCase } from "./create-recipient";

let inMemoryRecipientRepository: InMemoryRecipientRepository;

// System under test
let sut: CreateRecipientUseCase;

describe("Create Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();

    sut = new CreateRecipientUseCase(inMemoryRecipientRepository);
  });

  it("should be able to create a recipient", async () => {
    const recipient = makeRecipient({ city: "Aracaju" });

    const result = await sut.execute({
      city: recipient.city,
      cpf: recipient.cpf,
      district: recipient.district,
      name: recipient.name,
      email: recipient.email,
      number: recipient.number,
      phone: recipient.phone,
      state: recipient.state,
      street: recipient.street,
      zipCode: recipient.zipCode,
      complement: recipient.complement!,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      recipient: expect.objectContaining({ city: "Aracaju" }),
    });
  });
});
