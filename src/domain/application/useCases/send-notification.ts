import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { EmailService } from "../services/email.service";
import { UnkownError } from "./errors/UnkownError.error";

export interface SendNotificationUseCaseRequest {
  recipientEmail: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  UnkownError,
  {
    success: boolean;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private emailService: EmailService) {}

  async execute({
    recipientEmail,
    content,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    try {
      await this.emailService.sendEmail(recipientEmail, title, content);

      return right({
        success: true,
      });
    } catch (error) {
      return left(new UnkownError());
    }
  }
}
