import { OnOrderStatusUpdate } from "@/domain/application/subscribers/on-order-status-update";
import { SendNotificationUseCase } from "@/domain/application/useCases/send-notification";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [OnOrderStatusUpdate, SendNotificationUseCase],
})
export class EventsModule {}
