const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Category - RBAC CRUD", () => {
  let adminToken;
  let userToken;
  let categoryId;

  const admin = {
    name: "Admin",
    email: "admin@test.com",
    password: "123456",
  };

  const user = {
    name: "User",
    email: "user@test.com",
    password: "123456",
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

  it("admin pode criar categoria", async () => {
    const res = await request(app)
      .post("/category")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Eletrônicos",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Eletrônicos");

    categoryId = res.body.id;
  });

  it("user não pode criar categoria", async () => {
    const res = await request(app)
      .post("/category")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Documentos",
      });

    expect(res.statusCode).toBe(403);
  });

  it("todos podem listar categorias", async () => {
    const resUser = await request(app)
      .get("/category")
      .set("Authorization", `Bearer ${userToken}`);

    const resAdmin = await request(app)
      .get("/category")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(resUser.statusCode).toBe(200);
    expect(resAdmin.statusCode).toBe(200);
  });

  it("user pode buscar categoria por id", async () => {
    const res = await request(app)
      .get(`/category/${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(categoryId);
  });

  it("admin pode atualizar categoria", async () => {
    const res = await request(app)
      .put(`/category/${categoryId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Eletrônicos Atualizado",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Eletrônicos Atualizado");
  });

  it("user não pode atualizar categoria", async () => {
    const res = await request(app)
      .put(`/category/${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Hackeado",
      });

    expect(res.statusCode).toBe(403);
  });

  it("admin pode deletar categoria", async () => {
    const res = await request(app)
      .delete(`/category/${categoryId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("user não pode deletar categoria", async () => {
    const res = await request(app)
      .delete(`/category/${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});
