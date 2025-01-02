import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Reset a User Password (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PATCH] /account/:deliverierId/resetPassword", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });
    const access_token = jwt.sign({ sub: user.id, role: user.role });

    const deliverier = await userFactory.makePrismaUser();

    const response = await request(app.getHttpServer())
      .patch(`/account/${deliverier.id}/resetPassword`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        cpf: deliverier.cpf,
        email: deliverier.email,
        password: "123456789",
      });

    expect(response.statusCode).toBe(204);
  });
});
