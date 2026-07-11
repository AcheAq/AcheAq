const express = require("express");
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

const chatRoute = express.Router();
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Gerenciamento de conversas e mensagens entre usuários
 */

/**
 * @swagger
 * /chat/{itemId}:
 *   post:
 *     summary: Inicia uma conversa sobre um objeto
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do objeto relacionado à conversa
 *         example: 6c8f17cf-7f5c-4cf3-a7f0-6f0eec1d6e6d
 *     responses:
 *       201:
 *         description: Conversa criada com sucesso.
 *       400:
 *         description: Usuário tentou iniciar conversa com o próprio anúncio.
 *       401:
 *         description: Token inválido ou não informado.
 *       404:
 *         description: Objeto não encontrado.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno do servidor.
 */
chatRoute.post(
  "/:itemId",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  chatController.startConversation,
);

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Lista as conversas do usuário autenticado
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conversas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 9a7b4c12-1234-4567-8901-abcdef123456
 *                   itemId:
 *                     type: string
 *                     example: 6c8f17cf-7f5c-4cf3-a7f0-6f0eec1d6e6d
 *                   ownerId:
 *                     type: string
 *                     example: 12345678-abcd-4321-abcd-123456789abc
 *                   participantId:
 *                     type: string
 *                     example: 87654321-abcd-4321-abcd-123456789abc
 *       401:
 *         description: Token inválido ou não informado.
 *       500:
 *         description: Erro interno do servidor.
 */
chatRoute.get(
  "/",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  chatController.getUserConversations,
);

/**
 * @swagger
 * /chat/{conversationId}/messages:
 *   post:
 *     summary: Envia uma mensagem em uma conversa
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conversa
 *         example: 9a7b4c12-1234-4567-8901-abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Olá, ainda está disponível?
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso.
 *       400:
 *         description: Mensagem vazia ou dados inválidos.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Usuário não participa da conversa.
 *       404:
 *         description: Conversa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
chatRoute.post(
  "/:conversationId/messages",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  chatController.sendMessage,
);

/**
 * @swagger
 * /chat/{conversationId}/messages:
 *   get:
 *     summary: Busca as mensagens de uma conversa
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conversa
 *         example: 9a7b4c12-1234-4567-8901-abcdef123456
 *     responses:
 *       200:
 *         description: Mensagens retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 5b2f4d31-1111-2222-3333-acde12345678
 *                   content:
 *                     type: string
 *                     example: Podemos combinar a entrega amanhã.
 *                   isRead:
 *                     type: boolean
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   sender:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: João Silva
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Usuário não participa da conversa.
 *       404:
 *         description: Conversa não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
chatRoute.get(
  "/:conversationId/messages",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  chatController.getMessages,
);

module.exports = chatRoute;
