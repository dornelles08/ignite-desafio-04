import { makeOrder } from "test/factories/make-order";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { NotAllowed } from "./errors/NotAllowed.error";
import { NotFound } from "./errors/NotFound";
import { ReturnOrderUseCase } from "./return-order";

let inMemoryOrderRepository: InMemoryOrderRepository;
// System under test
let sut: ReturnOrderUseCase;

describe("Return Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();

    sut = new ReturnOrderUseCase(inMemoryOrderRepository);
  });

  it("should be able to return a order", async () => {
    const user = makeUser();
    const order = makeOrder({
      deliverierId: user.id,
      status: "PICKUP",
    });
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id,
      userId: user.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      order: expect.objectContaining({ status: "RETURNED", deliverierId: user.id }),
    });
  });

  it("should not be able to return an order in a status other than WAINTING", async () => {
    const user = makeUser();
    const order = makeOrder();
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id,
      userId: user.id,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowed);
  });

  it("should not be able to return a unexists order", async () => {
    const user = makeUser();
    const result = await sut.execute({
      orderId: "order.id",
      userId: user.id,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFound);
  });
});
