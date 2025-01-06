import { EmailService } from "@/domain/application/services/email.service";

import { Transporter, createTransport } from "nodemailer";
import { EnvService } from "../env/env.service";

export class NodemailerEmailService implements EmailService {
  private transporter: Transporter;

  constructor(envService: EnvService) {
    this.transporter = createTransport({
      host: envService.get("MAIL_HOST"),
      port: envService.get("MAIL_PORT"),
      auth: {
        user: envService.get("MAIL_USER"),
        pass: envService.get("MAIL_PASS"),
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: "lipe.dornelles08@gmail.com",
      to: to,
      subject: subject,
      html: body,
    });
  }
}
