import { EmailService } from "@/domain/application/services/email.service";
import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { NodemailerEmailService } from "./email.service";

@Module({
  imports: [EnvModule, ServicesModule],
  providers: [
    {
      provide: EmailService,
      useClass: NodemailerEmailService,
    },
  ],
  exports: [EmailService],
})
export class ServicesModule {}
