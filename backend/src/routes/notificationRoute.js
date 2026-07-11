const notificationRouter = require("express").Router();

const {
  getNotifications,
  readNotification,
} = require("../controllers/notificationController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gerenciamento de notificações do usuário
 */

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Lista as notificações do usuário autenticado
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificações retornadas com sucesso.
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
 *                   userId:
 *                     type: string
 *                     example: 12345678-abcd-4321-abcd-123456789abc
 *                   conversationId:
 *                     type: string
 *                     nullable: true
 *                     example: 87654321-abcd-4321-abcd-123456789abc
 *                   title:
 *                     type: string
 *                     example: Nova mensagem
 *                   message:
 *                     type: string
 *                     example: João enviou uma mensagem
 *                   read:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token inválido ou não informado.
 *       500:
 *         description: Erro interno do servidor.
 */
notificationRouter.get(
  "/",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  getNotifications,
);

/**
 * @swagger
 * /notification/{id}/read:
 *   patch:
 *     summary: Marca uma notificação como lida
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *         example: 9a7b4c12-1234-4567-8901-abcdef123456
 *     responses:
 *       200:
 *         description: Notificação marcada como lida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 9a7b4c12-1234-4567-8901-abcdef123456
 *                 read:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token inválido ou não informado.
 *       404:
 *         description: Notificação não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
notificationRouter.patch(
  "/:id/read",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  readNotification,
);

module.exports = notificationRouter;
