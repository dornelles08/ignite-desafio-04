import { FakeHahser } from "test/cryptography/fake-hasher";
import { generateCPF } from "test/helpers/generate-cpf";

import { makeUser } from "test/factories/make-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { ResetUserPasswordUseCase } from "./reset-user-password";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHahser;

let sut: ResetUserPasswordUseCase;

describe("Reset a User Password", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHahser();
    sut = new ResetUserPasswordUseCase(fakeHasher, inMemoryUserRepository);
  });

  it("should be able to reset user password", async () => {
    const user = makeUser({ cpf: generateCPF() });

    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id,
      email: user.email,
      password: "456789123",
      cpf: user.cpf,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({ user: inMemoryUserRepository.items[0] });
  });

  it("should not be able to reset user password with a wrong email", async () => {
    const user = makeUser({ cpf: generateCPF() });

    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id,
      email: "email@email.com",
      password: "456789123",
      cpf: user.cpf,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should not be able to reset user password with a wrong cpf", async () => {
    const user = makeUser({ cpf: generateCPF() });

    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id,
      email: user.email,
      password: "456789123",
      cpf: "12345678900",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should not be able to reset user password with a wrong user id", async () => {
    const user = makeUser({ cpf: generateCPF() });

    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      userId: "user.id",
      email: user.email,
      password: "456789123",
      cpf: user.cpf,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it("should not be able to reset user password with a wrong user id", async () => {
    const user = makeUser({ cpf: generateCPF() });

    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id,
      email: user.email,
      password: "456789123",
      cpf: user.cpf,
    });

    const passwordHashed = await fakeHasher.hash("456789123");

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.items[0].password).toEqual(passwordHashed);
  });
});
