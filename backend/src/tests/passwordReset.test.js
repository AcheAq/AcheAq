const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");
const { comparePassword } = require("../utils/hash.js");
const { generateToken, hashToken } = require("../utils/token.js");

const prisma = new PrismaClient();

describe("Password Reset", () => {
  const user = {
    name: "João Silva",
    email: "joao.reset@email.com",
    password: "gabrielbento",
    phone: "(82) 99999-9999",
    registration: "2023001234",
    course: "Ciência da Computação",
    institution: "IFAL",
  };

  let userId;
  let resetToken;

  async function createUserAndToken() {
    await prisma.user.deleteMany({
      where: {
        email: user.email,
      },
    });

    const response = await request(app).post("/auth/register").send(user);

    userId = response.body.id;

    resetToken = generateToken();

    await prisma.passwordResetToken.create({
      data: {
        token: hashToken(resetToken),
        userId,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
  }

  beforeEach(async () => {
    await createUserAndToken();
  });

  afterEach(async () => {
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: userId,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve solicitar recuperação de senha", async () => {
    const res = await request(app).post("/auth/forgot-password").send({
      email: user.email,
    });

    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe(
      "Se o e-mail estiver cadastrado, você receberá um link de recuperação.",
    );

    const token = await prisma.passwordResetToken.findFirst({
      where: {
        userId,
      },
    });

    expect(token).not.toBeNull();
    expect(token.usedAt).toBeNull();
  });

  it("deve redefinir a senha usando um token válido", async () => {
    const newPassword = "novaSenha123";

    const res = await request(app).post("/auth/reset-password").send({
      token: resetToken,
      password: newPassword,
    });

    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe("Senha atualizada com sucesso.");

    const updatedUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const passwordMatch = await comparePassword(
      newPassword,
      updatedUser.password,
    );

    expect(passwordMatch).toBe(true);

    const usedToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId,
      },
    });

    expect(usedToken.usedAt).not.toBeNull();
  });

  it("não deve permitir reutilizar o mesmo token", async () => {
    await request(app).post("/auth/reset-password").send({
      token: resetToken,
      password: "novaSenha123",
    });

    const res = await request(app).post("/auth/reset-password").send({
      token: resetToken,
      password: "outraSenha123",
    });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Token inválido ou expirado.");
  });

  it("não deve aceitar um token inválido", async () => {
    const res = await request(app).post("/auth/reset-password").send({
      token: "token-invalido",
      password: "novaSenha123",
    });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Token inválido ou expirado.");
  });

  it("não deve aceitar um token expirado", async () => {
    const expiredToken = generateToken();

    await prisma.passwordResetToken.create({
      data: {
        token: hashToken(expiredToken),
        userId,
        expiresAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    });

    const res = await request(app).post("/auth/reset-password").send({
      token: expiredToken,
      password: "novaSenha123",
    });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Token inválido ou expirado.");
  });
});
