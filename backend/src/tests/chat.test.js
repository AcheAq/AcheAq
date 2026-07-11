const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Chat", () => {
  let ownerToken;
  let participantToken;

  let ownerId;
  let participantId;

  let categoryId;
  let itemId;
  let conversationId;

  const owner = {
    name: "Owner",
    email: "owner@test.com",
    password: "123456",
    phone: "(82) 99999-9999",
    registration: "2023001111",
    course: "Computação",
    institution: "IFAL",
  };

  const participant = {
    name: "Participant",
    email: "participant@test.com",
    password: "123456",
    phone: "(82) 98888-8888",
    registration: "2023002222",
    course: "Computação",
    institution: "IFAL",
  };

  beforeAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.item.deleteMany();
    await prisma.category.deleteMany();

    await prisma.user.deleteMany({
      where: {
        email: {
          in: [owner.email, participant.email],
        },
      },
    });

    await request(app).post("/auth/register").send(owner);
    await request(app).post("/auth/register").send(participant);

    const ownerLogin = await request(app).post("/auth/login").send({
      email: owner.email,
      password: owner.password,
    });

    ownerToken = ownerLogin.body.token;

    const participantLogin = await request(app).post("/auth/login").send({
      email: participant.email,
      password: participant.password,
    });

    participantToken = participantLogin.body.token;

    const ownerUser = await prisma.user.findUnique({
      where: {
        email: owner.email,
      },
    });

    const participantUser = await prisma.user.findUnique({
      where: {
        email: participant.email,
      },
    });

    ownerId = ownerUser.id;
    participantId = participantUser.id;

    const category = await prisma.category.create({
      data: {
        name: "Eletrônicos",
      },
    });

    categoryId = category.id;

    const item = await prisma.item.create({
      data: {
        title: "Notebook Dell",
        description: "Notebook encontrado",
        categoryId,
        location: "Biblioteca",
        occurrenceDate: new Date(),
        type: "FOUND",
        userId: ownerId,
      },
    });

    itemId = item.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve iniciar uma conversa", async () => {
    const res = await request(app)
      .post(`/chat/${itemId}`)
      .set("Authorization", `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(201);

    expect(res.body.id).toBeDefined();

    conversationId = res.body.id;
  });

  it("deve reutilizar uma conversa existente", async () => {
    const res = await request(app)
      .post(`/chat/${itemId}`)
      .set("Authorization", `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(201);

    expect(res.body.id).toBe(conversationId);
  });

  it("não deve permitir iniciar conversa com o próprio anúncio", async () => {
    const res = await request(app)
      .post(`/chat/${itemId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe(
      "Você não pode iniciar uma conversa com seu próprio anúncio",
    );
  });

  it("deve listar as conversas do participante", async () => {
    const res = await request(app)
      .get("/chat")
      .set("Authorization", `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThan(0);
  });

  it("deve listar as conversas do dono do anúncio", async () => {
    const res = await request(app)
      .get("/chat")
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThan(0);
  });

  it("participante deve enviar mensagem", async () => {
    const res = await request(app)
      .post(`/chat/${conversationId}/messages`)
      .set("Authorization", `Bearer ${participantToken}`)
      .send({
        content: "Olá! Esse notebook ainda está com você?",
      });

    expect(res.statusCode).toBe(201);

    expect(res.body.content).toBe("Olá! Esse notebook ainda está com você?");
  });

  it("owner deve responder a mensagem", async () => {
    const res = await request(app)
      .post(`/chat/${conversationId}/messages`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        content: "Sim! Podemos combinar a entrega.",
      });

    expect(res.statusCode).toBe(201);

    expect(res.body.content).toBe("Sim! Podemos combinar a entrega.");
  });

  it("não deve permitir mensagem vazia", async () => {
    const res = await request(app)
      .post(`/chat/${conversationId}/messages`)
      .set("Authorization", `Bearer ${participantToken}`)
      .send({
        content: "",
      });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Mensagem vazia");
  });

  it("deve listar as mensagens da conversa", async () => {
    const res = await request(app)
      .get(`/chat/${conversationId}/messages`)
      .set("Authorization", `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThan(0);

    expect(res.body[0].content).toBeDefined();
  });

  it("deve retornar mensagens ordenadas por data crescente", async () => {
    const res = await request(app)
      .get(`/chat/${conversationId}/messages`)
      .set("Authorization", `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);

    for (let i = 0; i < res.body.length - 1; i++) {
      const atual = new Date(res.body[i].createdAt);
      const proxima = new Date(res.body[i + 1].createdAt);

      expect(atual <= proxima).toBe(true);
    }
  });

  it("deve marcar mensagens recebidas como lidas ao abrir a conversa", async () => {
    await request(app)
      .post(`/chat/${conversationId}/messages`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        content: "Mensagem para testar leitura",
      });

    const message = await prisma.message.findFirst({
      where: {
        conversationId,
        senderId: ownerId,
        content: "Mensagem para testar leitura",
      },
    });

    expect(message.isRead).toBe(false);

    const res = await request(app)
      .get(`/chat/${conversationId}/messages`)
      .set("Authorization", `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(200);

    const after = await prisma.message.findMany({
      where: {
        conversationId,
        senderId: ownerId,
      },
    });

    after.forEach((message) => {
      expect(message.isRead).toBe(true);
    });
  });

  it("não deve permitir acessar conversa de outro usuário", async () => {
    const outsider = {
      name: "Outsider",
      email: "outsider@test.com",
      password: "123456",
      phone: "(82) 97777-7777",
      registration: "2023003333",
      course: "Computação",
      institution: "IFAL",
    };

    await request(app).post("/auth/register").send(outsider);

    const outsiderLogin = await request(app).post("/auth/login").send({
      email: outsider.email,
      password: outsider.password,
    });

    const outsiderToken = outsiderLogin.body.token;

    const res = await request(app)
      .get(`/chat/${conversationId}/messages`)
      .set("Authorization", `Bearer ${outsiderToken}`);

    expect(res.statusCode).toBe(403);

    expect(res.body.message).toBe("Acesso negado");
  });

  it("não deve enviar mensagem para conversa inexistente", async () => {
    const res = await request(app)
      .post("/chat/conversa-inexistente/messages")
      .set("Authorization", `Bearer ${participantToken}`)
      .send({
        content: "Mensagem inválida",
      });

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Conversa não encontrada");
  });

  it("não deve listar mensagens de conversa inexistente", async () => {
    const res = await request(app)
      .get("/chat/conversa-inexistente/messages")
      .set("Authorization", `Bearer ${participantToken}`);

    expect(res.statusCode).toBe(404);

    expect(res.body.message).toBe("Conversa não encontrada");
  });
});
