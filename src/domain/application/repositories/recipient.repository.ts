import { Recipient } from "@/domain/enterprise/entities/recipient";

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findById(id: string): Promise<Recipient | null>;
}
