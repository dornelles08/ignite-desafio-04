import { OnOrderStatusUpdate } from "@/domain/application/subscribers/on-order-status-update";
import { SendNotificationUseCase } from "@/domain/application/useCases/send-notification";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ServicesModule } from "../services/services.module";

@Module({
  imports: [DatabaseModule, ServicesModule],
  providers: [OnOrderStatusUpdate, SendNotificationUseCase],
})
export class EventsModule {}
