import { User, UserProps } from "@/domain/enterprise/entities/user";
import { PrismaUserMapper } from "@/infra/database/prisma/mappers/prisma-user.mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { generateCPF } from "test/helpers/generate-cpf";

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: generateCPF(false),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
