import { emailTemplate } from "@/core/email.template";
import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { OrderStatusUpdateEvent } from "../events/order-status-update.event";
import { RecipientRepository } from "../repositories/recipient.repository";
import { SendNotificationUseCase } from "../useCases/send-notification";

export class OnOrderStatusUpdate implements EventHandler {
  constructor(
    private recipientRepository: RecipientRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.handle.bind(this), OrderStatusUpdateEvent.name);
  }

  private async handle({ order }: OrderStatusUpdateEvent): Promise<void> {
    console.log("handle");

    const recipient = await this.recipientRepository.findById(order.recipientId);

    if (recipient) {
      this.sendNotification.execute({
        recipientEmail: recipient.email,
        title: "Sua encomenda foi atualizada",
        content: emailTemplate(recipient.name, order.id, order.status),
      });
    }
  }
}
