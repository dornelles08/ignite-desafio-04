import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { OrderFactory } from "test/factories/make-order";
import { RecipientFactory } from "test/factories/make-recipient";
import { UserFactory } from "test/factories/make-user";

describe("Mark Order as Waiting (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let orderFactory: OrderFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    orderFactory = moduleRef.get(OrderFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /orders", async () => {
    const user = await userFactory.makePrismaUser();
    const access_token = jwt.sign({ sub: user.id, role: user.role });

    const [recipient1, recipient2] = await Promise.all([
      recipientFactory.makePrismaRecipient(),
      recipientFactory.makePrismaRecipient(),
    ]);

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: recipient1.id,
        deliverierId: user.id,
      }),
      orderFactory.makePrismaOrder({
        recipientId: recipient2.id,
        deliverierId: user.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/orders`)
      .set("Authorization", `Bearer ${access_token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          recipientId: recipient1.id,
          deliverierId: user.id,
        }),
        expect.objectContaining({
          recipientId: recipient2.id,
          deliverierId: user.id,
        }),
      ]),
    });
  });
});
