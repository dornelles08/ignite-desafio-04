import { Encrypter } from "@/domain/application/cryptography/encrypter";
import { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/application/cryptography/hash-generator";
import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
  providers: [
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
