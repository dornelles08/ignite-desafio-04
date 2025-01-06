import { makeOrder } from "test/factories/make-order";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order.repository";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient.repository";
import { FakeEmailService } from "test/services/fake-email.services";
import { waitFor } from "test/utils/wait-for";
import { MockInstance } from "vitest";
import { SendNotificationUseCase } from "../useCases/send-notification";
import { OnOrderStatusUpdate } from "./on-order-status-update";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let fakeEmailService: FakeEmailService;
let sendNotification: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe("On Order Status Update", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository();
    fakeEmailService = new FakeEmailService();
    sendNotification = new SendNotificationUseCase(fakeEmailService);

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, "execute");

    new OnOrderStatusUpdate(inMemoryRecipientRepository, sendNotification);
  });

  it("should send notification when order is created", async () => {
    const recipient = makeRecipient();
    const order = makeOrder({ recipientId: recipient.id });

    inMemoryRecipientRepository.create(recipient);
    inMemoryOrderRepository.create(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });

  it("should send notification when order status is updated", async () => {
    const recipient = makeRecipient();
    const order = makeOrder({ recipientId: recipient.id });

    inMemoryRecipientRepository.create(recipient);
    inMemoryOrderRepository.create(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });

    order.status = "WAITING";

    inMemoryOrderRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
