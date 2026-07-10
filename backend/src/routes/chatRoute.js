const express = require("express");
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

const chatRoute = express.Router();

chatRoute.post(
  "/:itemId",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  chatController.startConversation,
);

chatRoute.get(
  "/",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  chatController.getUserConversations,
);

chatRoute.post(
  "/:conversationId/messages",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  chatController.sendMessage,
);

chatRoute.get(
  "/:conversationId/messages",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  chatController.getMessages,
);

module.exports = chatRoute;
