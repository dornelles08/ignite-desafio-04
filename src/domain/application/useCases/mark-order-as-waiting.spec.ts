import { makeOrder } from "test/factories/make-order";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { NotFound } from "./errors/NotFound";
import { MarkOrderAsWaitingUseCase } from "./mark-order-as-waiting";

let inMemoryOrderRepository: InMemoryOrderRepository;
// System under test
let sut: MarkOrderAsWaitingUseCase;

describe("Create Order", () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();

    sut = new MarkOrderAsWaitingUseCase(inMemoryOrderRepository);
  });

  it("should be able to mark a order as waiting", async () => {
    const order = makeOrder();
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      order: expect.objectContaining({ status: "WAITING" }),
    });
  });

  it("should not be able to mark a order as waiting if order not exists", async () => {
    const result = await sut.execute({
      orderId: "order.id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFound);
  });
});
