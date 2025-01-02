import { Either, left, right } from "@/core/either";
import { User } from "@/domain/enterprise/entities/user";
import { HashGenerator } from "../cryptography/hash-generator";
import { UserRepository } from "../repositories/users.repository";
import { UnkownError } from "./errors/UnkownError.error";
import { UserNotFoundError } from "./errors/UserNotFoundError";

interface ResetUserPasswordRequest {
  userId: string;
  cpf: string;
  email: string;
  password: string;
}

type ResetUserPasswordResponse = Either<UserNotFoundError | UnkownError, { user: User }>;

export class ResetUserPasswordUseCase {
  constructor(private hashGenerator: HashGenerator, private userRepository: UserRepository) {}

  async execute({
    cpf,
    email,
    password,
    userId,
  }: ResetUserPasswordRequest): Promise<ResetUserPasswordResponse> {
    try {
      const user = await this.userRepository.findByIdCpfEmail(userId, cpf, email);

      if (!user) {
        return left(new UserNotFoundError());
      }

      const hashedPassword = await this.hashGenerator.hash(password);

      user.password = hashedPassword;

      await this.userRepository.save(user);

      return right({ user });
    } catch (error) {
      return left(new UnkownError());
    }
  }
}
