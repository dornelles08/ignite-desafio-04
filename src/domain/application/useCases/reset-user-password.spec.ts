import { FakeHahser } from "test/cryptography/fake-hasher";
import { generateCPF } from "test/helpers/generate-cpf";

import { makeUser } from "test/factories/make-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
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

  it("should be able to create a user", async () => {
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
});
