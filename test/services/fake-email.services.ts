import { EmailService } from "@/domain/application/services/email.service";

export class FakeEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email to ${to} with subject "${subject}" and body "${body}"`);
  }
}
