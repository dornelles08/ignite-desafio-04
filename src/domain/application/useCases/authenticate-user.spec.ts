import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHahser } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { generateCPF } from "test/helpers/generate-cpf";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { WrongCredentialsExists } from "./errors/WrongCredentialsExists.error";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHahser;
let fakeEncrypter: FakeEncrypter;
// System under test
let sut: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHahser();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateUserUseCase(inMemoryUserRepository, fakeHasher, fakeEncrypter);
  });

  it("should be able to authenticate a user", async () => {
    const cpf = generateCPF();
    const user = makeUser({
      cpf,
      password: await fakeHasher.hash("123456"),
    });

    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      cpf,
      password: "123456",
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    const cpf = generateCPF();
    const user = makeUser({
      cpf,
      password: await fakeHasher.hash("1234567"),
    });

    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      cpf,
      password: "123456",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsExists);
  });

  it("should not be able to authenticate a user with wrong cpf", async () => {
    const user = makeUser({
      cpf: generateCPF(),
      password: await fakeHasher.hash("123456"),
    });

    inMemoryUserRepository.items.push(user);

    const result = await sut.execute({
      cpf: generateCPF(),
      password: "123456",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsExists);
  });
});
