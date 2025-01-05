import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { NotFound } from "./errors/NotFound";
import { PickupOrderUseCase } from "./pickup-order";

let inMemoryOrderRepository: InMemoryOrderRepository;
// System under test
let sut: PickupOrderUseCase;

describe("Pickup Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();

    sut = new PickupOrderUseCase(inMemoryOrderRepository);
  });

  it("should be able to pickup a order", async () => {
    const user = makeUser();
    const order = makeOrder();
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id,
      userId: user.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      order: expect.objectContaining({ status: "PICKUP", deliverierId: user.id }),
    });
  });

  it("should not be able to pickup a unexists order", async () => {
    const user = makeUser();
    const result = await sut.execute({
      orderId: "order.id",
      userId: user.id,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFound);
  });
});
