const chatRepository = require("../repositories/chatRepository");
const itemRepository = require("../repositories/itemRepository");
const notificationService = require("./notificationService");

async function startConversation(currentUser, itemId) {
  const item = await itemRepository.findItemById(itemId);

  if (!item) {
    const error = new Error("Objeto não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (item.userId === currentUser.id) {
    const error = new Error(
      "Você não pode iniciar uma conversa com seu próprio anúncio",
    );
    error.statusCode = 400;
    throw error;
  }

  const conversation =
    await chatRepository.findConversationByItemAndParticipant(
      itemId,
      item.userId,
      currentUser.id,
    );

  if (conversation) {
    return conversation;
  }

  return await chatRepository.createConversation({
    itemId,
    ownerId: item.userId,
    participantId: currentUser.id,
  });
}

async function getUserConversations(currentUser) {
  return await chatRepository.findUserConversations(currentUser.id);
}

async function sendMessage(currentUser, conversationId, content) {
  const conversation =
    await chatRepository.findConversationById(conversationId);

  if (!conversation) {
    const error = new Error("Conversa não encontrada");
    error.statusCode = 404;
    throw error;
  }

  const isParticipant =
    conversation.ownerId === currentUser.id ||
    conversation.participantId === currentUser.id;

  if (!isParticipant) {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  if (!content || content.trim() === "") {
    const error = new Error("Mensagem vazia");
    error.statusCode = 400;
    throw error;
  }

  const message = await chatRepository.createMessage({
    conversationId,
    senderId: currentUser.id,
    content,
  });

  const receiverId =
    conversation.ownerId === currentUser.id
      ? conversation.participantId
      : conversation.ownerId;

  await notificationService.createNotification({
    userId: receiverId,
    conversationId,
    title: "Nova mensagem",
    message: `${currentUser.name} enviou uma mensagem`,
  });

  return message;
}

async function getMessages(currentUser, conversationId) {
  const conversation =
    await chatRepository.findConversationById(conversationId);

  if (!conversation) {
    const error = new Error("Conversa não encontrada");
    error.statusCode = 404;
    throw error;
  }

  const isParticipant =
    conversation.ownerId === currentUser.id ||
    conversation.participantId === currentUser.id;

  if (!isParticipant) {
    const error = new Error("Acesso negado");
    error.statusCode = 403;
    throw error;
  }

  await chatRepository.markMessagesAsRead(conversationId, currentUser.id);

  return await chatRepository.findMessagesByConversation(conversationId);
}

module.exports = {
  startConversation,
  getUserConversations,
  sendMessage,
  getMessages,
};
