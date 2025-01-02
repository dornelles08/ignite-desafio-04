import { AppModule } from "@/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeUser } from "test/factories/make-user";
import { generateCPF } from "test/helpers/generate-cpf";

describe("Create account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /accounts", async () => {
    const user = makeUser({ role: "ADMIN" });
    const access_token = jwt.sign({ sub: user.id, role: user.role });

    const response = await request(app.getHttpServer())
      .post("/accounts")
      .set("Authorization", `Bearer ${access_token}`)
      .send({
        name: "John Doe",
        email: "johndoe@examplo.com",
        cpf: generateCPF(),
        password: "123456",
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "johndoe@examplo.com",
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
