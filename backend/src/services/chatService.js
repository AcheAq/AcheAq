const chatRepository = require("../repositories/chatRepository");
const itemRepository = require("../repositories/itemRepository");

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

  return await chatRepository.createMessage({
    conversationId,
    senderId: currentUser.id,
    content,
  });
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

  return await chatRepository.findMessagesByConversation(conversationId);
}

module.exports = {
  startConversation,
  getUserConversations,
  sendMessage,
  getMessages,
};
