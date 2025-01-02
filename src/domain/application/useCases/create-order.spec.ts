import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient.repository";
import { CreateOrderUseCase } from "./create-order";

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

    makeOrder({
      recipientId: recipient.id,
    });

    const result = await sut.execute({
      recipientId: recipient.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      order: expect.objectContaining({ recipientId: recipient.id, status: "CREATED" }),
    });
  });
});
