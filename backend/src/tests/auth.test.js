const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Auth - Register, Login e Change Password", () => {
  const user = {
    name: "João Silva",
    email: "joao@email.com",
    password: "gabrielbento",
    phone: "(82) 99999-9999",
    registration: "2023001234",
    course: "Ciência da Computação",
    institution: "IFAL",
  };

  let token;

  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: user.email },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: user.email },
    });

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

    token = res.body.token;
  });

  it("deve alterar a senha do usuário", async () => {
    const res = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: user.password,
        newPassword: "novaSenha123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("não deve alterar a senha com senha atual incorreta", async () => {
    const res = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "senhaErrada",
        newPassword: "novaSenha123",
      });

    expect(res.statusCode).toBe(400);
  });

  it("não deve alterar a senha com nova senha vazia", async () => {
    const res = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "novaSenha123",
        newPassword: "",
      });

    expect(res.statusCode).toBe(400);
  });

  it("não deve alterar a senha com menos de 6 caracteres", async () => {
    const res = await request(app)
      .patch("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "novaSenha123",
        newPassword: "123",
      });

    expect(res.statusCode).toBe(400);
  });
});
