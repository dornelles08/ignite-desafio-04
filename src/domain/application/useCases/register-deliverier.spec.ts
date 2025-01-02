import { FakeHahser } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { generateCPF } from "test/helpers/generate-cpf";

import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { CpfInvalidError } from "./errors/CpfInvalid.error";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExists.error";
import { RegisterDeliverierUseCase } from "./register-deliverier";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHahser;

let sut: RegisterDeliverierUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHahser();
    sut = new RegisterDeliverierUseCase(fakeHasher, inMemoryUserRepository);
  });

  it("should be able to create a user", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
      cpf: generateCPF(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({ user: inMemoryUserRepository.items[0] });
  });

  it("should not be able to create a user with a exists email", async () => {
    const email = "johndoe@example.com";
    inMemoryUserRepository.items.push(makeUser({ email }));

    const result = await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
      cpf: "13648686011",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should not be able to create a user with a exists cpf", async () => {
    const cpf = generateCPF();
    inMemoryUserRepository.items.push(makeUser({ cpf }));

    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
      cpf,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should not be able to create a user with a invalid cpf", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
      cpf: "12345678900",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(CpfInvalidError);
  });

  it("should hash user password upon registration", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
      cpf: generateCPF(),
    });

    const passwordHashed = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.items[0].password).toEqual(passwordHashed);
  });
});
