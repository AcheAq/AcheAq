const chatService = require("../services/chatService");

async function startConversation(req, res) {
  try {
    const conversation = await chatService.startConversation(
      req.user,
      req.params.itemId,
    );

    return res.status(201).json(conversation);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getUserConversations(req, res) {
  try {
    const conversations = await chatService.getUserConversations(req.user);

    return res.status(200).json(conversations);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function sendMessage(req, res) {
  try {
    const message = await chatService.sendMessage(
      req.user,
      req.params.conversationId,
      req.body.content,
    );

    return res.status(201).json(message);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function getMessages(req, res) {
  try {
    const messages = await chatService.getMessages(
      req.user,
      req.params.conversationId,
    );

    return res.status(200).json(messages);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  startConversation,
  getUserConversations,
  sendMessage,
  getMessages,
};
