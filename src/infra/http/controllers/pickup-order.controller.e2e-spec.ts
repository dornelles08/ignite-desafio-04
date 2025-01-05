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

describe("Pickup Order (E2E)", () => {
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

  test("[POST] /orders/:orderId/pickup", async () => {
    const user = await userFactory.makePrismaUser({ role: "DELIVERIER" });
    const access_token = jwt.sign({ sub: user.id, role: user.role });

    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const response = await request(app.getHttpServer())
      .post(`/orders/${order.id}/pickup`)
      .set("Authorization", `Bearer ${access_token}`)
      .send();

    expect(response.statusCode).toBe(204);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        id: order.id,
      },
    });

    expect(orderOnDatabase).toEqual(
      expect.objectContaining({
        status: "PICKUP",
      })
    );
  });
});
