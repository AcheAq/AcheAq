const express = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

const categoryRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gerenciamento de categorias
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
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
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       409:
 *         description: Categoria já existe.
 *       500:
 *         description: Erro interno do servidor.
 */
categoryRoute.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  categoryController.create,
);

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *       401:
 *         description: Token inválido ou não informado.
 *       500:
 *         description: Erro interno do servidor.
 */
categoryRoute.get(
  "/",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  categoryController.getAll,
);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Busca categoria por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada.
 *       401:
 *         description: Token inválido ou não informado.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
categoryRoute.get(
  "/:id",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  categoryController.getById,
);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Atualiza uma categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
categoryRoute.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  categoryController.update,
);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
categoryRoute.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  categoryController.remove,
);

module.exports = categoryRoute;
