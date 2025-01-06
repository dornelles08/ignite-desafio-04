import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { makeUser } from "test/factories/make-user";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { FakeEmailService } from "test/services/fake-email.services";
import { SendNotificationUseCase } from "./send-notification";

let emailService: FakeEmailService;
let inMemoryOrderRepository: InMemoryOrderRepository;
// System under test
let sut: SendNotificationUseCase;

describe("Return Order", () => {
  beforeEach(() => {
    emailService = new FakeEmailService();
    inMemoryOrderRepository = new InMemoryOrderRepository();

    sut = new SendNotificationUseCase(emailService);
  });

  it("should be able to send a notification", async () => {
    const user = makeUser();
    const recipient = makeRecipient();
    const order = makeOrder({
      deliverierId: user.id,
      status: "PICKUP",
    });
    inMemoryOrderRepository.items.push(order);

    const result = await sut.execute({
      recipientEmail: recipient.email,
      title: "Nova notificação",
      content: "Conteúdo da notificação",
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      success: true,
    });
  });
});
