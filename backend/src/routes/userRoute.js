const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

const userRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
userRoute.get(
  "/me",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  userController.getMe,
);

/**
 * @swagger
 * /user/me:
 *   patch:
 *     summary: Atualiza os dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
userRoute.patch(
  "/me",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  userController.updateMe,
);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       500:
 *         description: Erro interno do servidor.
 */
userRoute.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  userController.getAll,
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Usuário encontrado.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
userRoute.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  userController.getById,
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
userRoute.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  userController.remove,
);

module.exports = userRoute;
