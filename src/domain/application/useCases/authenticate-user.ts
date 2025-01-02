import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypter";
import { HashComparer } from "../cryptography/hash-comparer";
import { UserRepository } from "../repositories/users.repository";
import { WrongCredentialsExistsError } from "./errors/WrongCredentialsExists.error";

interface AuthenticateUserRequest {
  password: string;
  cpf: string;
}

type AuthenticateUserResponse = Either<
  WrongCredentialsExistsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({ password, cpf }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByCpf(cpf);

    if (!user) {
      return left(new WrongCredentialsExistsError());
    }

    const isPasswordValid = await this.hashComparer.compare(password, user.password);

    if (!isPasswordValid) {
      return left(new WrongCredentialsExistsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
      role: user.role,
    });

    return right({
      accessToken,
    });
  }
}