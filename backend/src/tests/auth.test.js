const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Auth - Register e Login", () => {
  const user = {
    name: "João Silva",
    email: "joao@email.com",
    password: "gabrielbento",
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: user.email },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve criar um usuário", async () => {
    const res = await request(app).post("/auth/register").send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(user.email);
  });

  it("deve fazer login do usuário", async () => {
    const res = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
