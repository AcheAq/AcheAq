const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const prisma = new PrismaClient();

describe("Item - RBAC CRUD", () => {
  let adminToken;
  let userToken;
  let itemId;
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

    const category = await prisma.category.create({
      data: {
        name: "Eletrônicos",
      },
    });

    categoryId = category.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("user pode criar item", async () => {
    const res = await request(app)
      .post("/item")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Mochila preta",
        description: "Mochila Adidas encontrada no pátio",
        categoryId,
        location: "Pátio central",
        occurrenceDate: new Date().toISOString(),
        type: "LOST",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Mochila preta");

    itemId = res.body.id;
  });

  it("admin pode criar item", async () => {
    const res = await request(app)
      .post("/item")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Carteira encontrada",
        description: "Carteira preta com documentos",
        categoryId,
        location: "Bloco A",
        occurrenceDate: new Date().toISOString(),
        type: "FOUND",
      });

    expect(res.statusCode).toBe(201);
  });

  it("todos podem listar itens", async () => {
    const resUser = await request(app)
      .get("/item")
      .set("Authorization", `Bearer ${userToken}`);

    const resAdmin = await request(app)
      .get("/item")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(resUser.statusCode).toBe(200);
    expect(resAdmin.statusCode).toBe(200);
  });

  it("user pode buscar item por id", async () => {
    const res = await request(app)
      .get(`/item/${itemId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(itemId);
  });

  it("user pode atualizar seu próprio item", async () => {
    const res = await request(app)
      .patch(`/item/${itemId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Mochila atualizada",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Mochila atualizada");
  });

  it("admin pode atualizar qualquer item", async () => {
    const res = await request(app)
      .patch(`/item/${itemId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Atualizado pelo admin",
      });

    expect(res.statusCode).toBe(200);
  });

  it("user pode marcar item como resolvido", async () => {
    const res = await request(app)
      .patch(`/item/${itemId}/resolve`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("RESOLVED");
  });

  it("não deve criar item com categoria inexistente", async () => {
    const res = await request(app)
      .post("/item")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Item inválido",
        description: "Teste de categoria inexistente",
        categoryId: "999999",
        location: "Bloco B",
        occurrenceDate: new Date().toISOString(),
        type: "LOST",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Categoria não encontrada");
  });

  it("user pode criar item com imagem", async () => {
    const res = await request(app)
      .post("/item")
      .set("Authorization", `Bearer ${userToken}`)
      .field("title", "Mochila com foto")
      .field("description", "Mochila Adidas encontrada")
      .field("categoryId", categoryId)
      .field("location", "Pátio central")
      .field("occurrenceDate", new Date().toISOString())
      .field("type", "LOST")
      .attach("image", path.join(__dirname, "files", "celular.jpg"));

    expect(res.statusCode).toBe(201);
    expect(res.body.photoUrl).toBeDefined();
  });

  it("não deve aceitar arquivo que não seja imagem", async () => {
    const res = await request(app)
      .post("/item")
      .set("Authorization", `Bearer ${userToken}`)
      .field("title", "Arquivo inválido")
      .field("description", "Teste enviando arquivo que não é imagem")
      .field("categoryId", categoryId)
      .field("location", "Bloco B")
      .field("occurrenceDate", new Date().toISOString())
      .field("type", "LOST")
      .attach("image", path.join(__dirname, "files", "arquivo.txt"));

    expect(res.statusCode).toBe(400);
  });

  it("admin pode deletar item", async () => {
    const res = await request(app)
      .delete(`/item/${itemId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("user não pode deletar item", async () => {
    const res = await request(app)
      .delete(`/item/${itemId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});
