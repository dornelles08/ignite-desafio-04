import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Create Order (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let recipientFacptry: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    recipientFacptry = moduleRef.get(RecipientFactory);

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /orders", async () => {
    const user = await userFactory.makePrismaUser({ role: "ADMIN" });
    const access_token = jwt.sign({ sub: user.id, role: user.role });

    const recipient = await recipientFacptry.makePrismaRecipient();

    const response = await request(app.getHttpServer())
      .post("/orders")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        recipientId: recipient.id,
      });

    expect(response.statusCode).toBe(201);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId: recipient.id,
      },
    });

    expect(orderOnDatabase).toBeTruthy();
  });
});
