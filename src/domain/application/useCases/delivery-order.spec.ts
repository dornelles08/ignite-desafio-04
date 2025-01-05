import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { DeliveryOrderUseCase } from "./delivery-order";
import { NotAllowed } from "./errors/NotAllowed.error";
import { NotFound } from "./errors/NotFound";

let inMemoryOrderRepository: InMemoryOrderRepository;
// System under test
let sut: DeliveryOrderUseCase;

describe("Delivery Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();

    sut = new DeliveryOrderUseCase(inMemoryOrderRepository);
  });

  it("should be able to delivery an order", async () => {
    const user = makeUser();
    const order = makeOrder({
      status: "PICKUP",
      deliverierId: user.id,
    });
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id,
      userId: user.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      order: expect.objectContaining({ status: "DELIVERED" }),
    });
  });

  it("should not be able to delivery an unexists order", async () => {
    const user = makeUser();
    const result = await sut.execute({
      orderId: "order.id",
      userId: user.id,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFound);
  });

  it("should not be able to delivery an order from another user", async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    const order = makeOrder({
      status: "PICKUP",
      deliverierId: user1.id,
    });
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id,
      userId: user2.id,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowed);
  });

  it("should not be able to delivery an order in a status other than PICKUP", async () => {
    const user = makeUser();
    const order = makeOrder({
      status: "WAITING",
      deliverierId: user.id,
    });
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id,
      userId: user.id,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowed);
  });
});
