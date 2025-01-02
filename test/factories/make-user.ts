import { User, UserProsps } from "@/domain/enterprise/entities/user";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { generateCPF } from "test/helpers/generate-cpf";

export function makeUser(override: Partial<UserProsps> = {}, id?: string) {
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
export class userFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismauser(data: Partial<UserProsps> = {}): Promise<User> {
    const user = makeUser(data);

    // await this.prisma.user.create({
    //   data: PrismauserMapper.toPrisma(user),
    // });

    return user;
  }
}
