const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Auth - Register e Login", () => {
  const user = {
    name: "João Silva",
    email: "joao@email.com",
    password: "gabrielbento",
    phone: "(82) 99999-9999",
    registration: "2023001234",
    course: "Ciência da Computação",
    institution: "IFAL",
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
    expect(res.body.name).toBe(user.name);
    expect(res.body.phone).toBe(user.phone);
  });

  it("deve fazer login do usuário", async () => {
    const res = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(user.email);
  });
});
