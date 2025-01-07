import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { InMemoryPhotoRepository } from "test/repositories/in-memory-photo.repository";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient.repository";
import { FetchDeliverierOrdersUseCase } from "./fetch-deliverier-orders";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryPhotoRepository: InMemoryPhotoRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
// System under test
let sut: FetchDeliverierOrdersUseCase;

describe("Fetch Deliverier Orders", () => {
  beforeEach(() => {
    inMemoryPhotoRepository = new InMemoryPhotoRepository();
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryPhotoRepository,
      inMemoryRecipientRepository
    );

    sut = new FetchDeliverierOrdersUseCase(inMemoryOrderRepository);
  });

  it("should be able to fetch deliverier orders", async () => {
    const user = makeUser();
    const recipient = makeRecipient();
    inMemoryRecipientRepository.items.push(recipient);

    inMemoryOrderRepository.items.push(
      makeOrder({ recipientId: recipient.id, deliverierId: user.id })
    );
    inMemoryOrderRepository.items.push(
      makeOrder({ recipientId: recipient.id, deliverierId: user.id })
    );

    const result = await sut.execute({ deliverierId: user.id, page: 1 });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.orders).toHaveLength(2);
  });

  it("should not be able to fetch orders from another deliverier", async () => {
    const user1 = makeUser();
    const user2 = makeUser();

    inMemoryOrderRepository.items.push(makeOrder({ deliverierId: user1.id }));
    inMemoryOrderRepository.items.push(makeOrder({ deliverierId: user1.id }));

    const result = await sut.execute({ deliverierId: user2.id, page: 1 });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.orders).toHaveLength(0);
  });

  it("should be able to fetch paginated question answers", async () => {
    const user = makeUser();
    const recipient = makeRecipient();
    inMemoryRecipientRepository.items.push(recipient);

    for (let i = 1; i <= 22; i++) {
      await inMemoryOrderRepository.create(
        makeOrder({ recipientId: recipient.id, deliverierId: user.id })
      );
    }

    const result = await sut.execute({ deliverierId: user.id, page: 2 });

    expect(result.value?.orders).toHaveLength(2);
  });
});
