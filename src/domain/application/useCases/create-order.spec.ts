import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient.repository";
import { CreateOrderUseCase } from "./create-order";
import { RecipientNotFound } from "./errors/RecipientNotFound.error";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
// System under test
let sut: CreateOrderUseCase;

describe("Create Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryRecipientRepository = new InMemoryRecipientRepository();

    sut = new CreateOrderUseCase(inMemoryOrderRepository, inMemoryRecipientRepository);
  });

  it("should be able to create a order", async () => {
    const recipient = makeRecipient();
    inMemoryRecipientRepository.items.push(recipient);

    const result = await sut.execute({
      recipientId: recipient.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      order: expect.objectContaining({ recipientId: recipient.id, status: "CREATED" }),
    });
  });

  it("should not be able to create a order with a unexists recipient", async () => {
    const result = await sut.execute({
      recipientId: "recipient-1",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(RecipientNotFound);
  });
});
