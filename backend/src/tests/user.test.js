const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("User - RBAC CRUD", () => {
  let adminToken;
  let userToken;

  const admin = {
    name: "Admin",
    email: "admin@test.com",
    password: "123456",
    phone: "(82) 99999-9999",
    registration: "2023001234",
    course: "Ciência da Computação",
    institution: "IFAL",
  };

  const user = {
    name: "User",
    email: "user@test.com",
    password: "123456",
    phone: "(82) 99999-9999",
    registration: "2023001234",
    course: "Ciência da Computação",
    institution: "IFAL",
  };

  beforeAll(async () => {
    await prisma.item.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: { in: [admin.email, user.email] },
      },
    });

    await request(app).post("/auth/register").send(admin);

    await request(app).post("/auth/register").send(user);

    await prisma.user.update({
      where: { email: admin.email },
      data: { role: "ADMIN" },
    });

    const adminLogin = await request(app).post("/auth/login").send({
      email: admin.email,
      password: admin.password,
    });

    adminToken = adminLogin.body.token;

    const userLogin = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    userToken = userLogin.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("admin deve listar usuários", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("user não deve listar usuários", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("user pode ver próprio perfil", async () => {
    const res = await request(app)
      .get("/user/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("phone");
    expect(res.body).toHaveProperty("registration");
    expect(res.body).toHaveProperty("course");
    expect(res.body).toHaveProperty("institution");
  });

  it("user pode atualizar o proprio perfil", async () => {
    const res = await request(app)
      .patch("/user/me")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "User II",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("User II");
  });
});
