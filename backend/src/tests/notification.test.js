const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Notification", () => {
  let userToken;
  let otherUserToken;

  let userId;
  let otherUserId;

  let notificationId;

  const user = {
    name: "Notification User",
    email: "notification@test.com",
    password: "123456",
    phone: "(82) 99999-1111",
    registration: "2023004444",
    course: "Computação",
    institution: "IFAL",
  };

  const otherUser = {
    name: "Other User",
    email: "othernotification@test.com",
    password: "123456",
    phone: "(82) 99999-2222",
    registration: "2023005555",
    course: "Computação",
    institution: "IFAL",
  };

  beforeAll(async () => {
    await prisma.notification.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: {
          in: [user.email, otherUser.email],
        },
      },
    });

    await request(app).post("/auth/register").send(user);

    await request(app).post("/auth/register").send(otherUser);

    const userLogin = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    userToken = userLogin.body.token;

    const otherLogin = await request(app).post("/auth/login").send({
      email: otherUser.email,
      password: otherUser.password,
    });

    otherUserToken = otherLogin.body.token;

    const userData = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    const otherUserData = await prisma.user.findUnique({
      where: {
        email: otherUser.email,
      },
    });

    userId = userData.id;
    otherUserId = otherUserData.id;

    const notification = await prisma.notification.create({
      data: {
        userId,
        title: "Nova mensagem",
        message: "Você recebeu uma nova mensagem",
        read: false,
      },
    });

    notificationId = notification.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("usuário pode listar suas notificações", async () => {
    const res = await request(app)
      .get("/notification")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThan(0);

    expect(res.body[0].title).toBe("Nova mensagem");
  });

  it("usuário não deve receber notificações de outro usuário", async () => {
    const res = await request(app)
      .get("/notification")
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(200);

    res.body.forEach((notification) => {
      expect(notification.userId).toBe(otherUserId);
    });
  });

  it("usuário pode marcar notificação como lida", async () => {
    const res = await request(app)
      .patch(`/notification/${notificationId}/read`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);

    expect(res.body.read).toBe(true);

    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    expect(notification.read).toBe(true);
  });

  it("não deve marcar notificação inexistente como lida", async () => {
    const res = await request(app)
      .patch("/notification/not-found/read")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Notification not found");
  });

  it("não deve permitir marcar notificação de outro usuário", async () => {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title: "Mensagem privada",
        message: "Teste de segurança",
        read: false,
      },
    });

    const res = await request(app)
      .patch(`/notification/${notification.id}/read`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Access denied");
  });
});
