import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";

describe("Create Recipient (E2E)", () => {
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

  test("[POST] /recipient", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });
    const access_token = jwt.sign({ sub: user.id, role: user.role });

    const response = await request(app.getHttpServer())
      .post("/recipient")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "Gael Sebastião Luan Assis",
        cpf: "27832902515",
        phone: "9836173951",
        street: "Rua Paz",
        number: "572",
        complement: "",
        district: "Parque Nice Lobão",
        city: "São Luís",
        state: "MA",
        zipCode: "65044454",
      });

    expect(response.statusCode).toBe(201);

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: "Gael Sebastião Luan Assis",
      },
    });

    expect(recipientOnDatabase).toBeTruthy();
  });
});
