import { Either, left, right } from "@/core/either";
import { User } from "@/domain/enterprise/entities/user";
import { Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptography/hash-generator";
import { CpfValidator } from "../helpers/cpf-validator";
import { UserRepository } from "../repositories/users.repository";
import { CpfInvalidError } from "./errors/CpfInvalid.error";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExists.error";

interface RegisterDeliverierRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

type RegisterDeliverierResponse = Either<
  UserAlreadyExistsError | CpfInvalidError,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterDeliverierUseCase {
  constructor(
    private hashGenerator: HashGenerator,
    private userRepository: UserRepository,
    private cpfValidator: CpfValidator
  ) {}

  async execute({
    name,
    email,
    password,
    cpf,
  }: RegisterDeliverierRequest): Promise<RegisterDeliverierResponse> {
    const isCpfValid = this.cpfValidator.valid(cpf);

    if (!isCpfValid) {
      return left(new CpfInvalidError());
    }

    const [emailExists, cpfExists] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.userRepository.findByCpf(cpf),
    ]);

    if (emailExists || cpfExists) {
      return left(new UserAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({ name, email, password: hashedPassword, cpf });

    await this.userRepository.create(user);

    return right({ user });
  }
}
