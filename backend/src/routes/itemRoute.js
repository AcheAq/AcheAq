const express = require("express");
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");
const upload = require("../middlewares/uploadMiddleware");

const itemRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Gerenciamento de objetos perdidos e encontrados
 */

/**
 * @swagger
 * /item:
 *   post:
 *     summary: Cadastra um novo objeto perdido ou encontrado
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - categoryId
 *               - location
 *               - occurrenceDate
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mochila preta
 *               description:
 *                 type: string
 *                 example: Mochila Adidas contendo um notebook e um caderno.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Foto do objeto perdido ou encontrado.
 *               categoryId:
 *                 type: string
 *                 example: 6c8f17cf-7f5c-4cf3-a7f0-6f0eec1d6e6d
 *               location:
 *                 type: string
 *                 example: Bloco B - Laboratório 03
 *               occurrenceDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-10T14:30:00.000Z"
 *               type:
 *                 type: string
 *                 enum: [LOST, FOUND]
 *                 example: LOST
 *     responses:
 *       201:
 *         description: Objeto cadastrado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso negado.
 *       500:
 *         description: Erro interno do servidor.
 */
itemRoute.post(
  "/",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  upload.single("image"),
  itemController.create,
);

/**
 * @swagger
 * /item:
 *   get:
 *     summary: Lista todos os objetos (perdidos e encontrados)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [LOST, FOUND]
 *         description: Filtrar por tipo do objeto (perdido ou encontrado)
 *
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [OPEN, RESOLVED]
 *         description: Filtrar por status do objeto
 *
 *       - in: query
 *         name: categoryId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Pesquisa pelo título ou descrição do objeto
 *
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar pelo local onde o objeto foi perdido ou encontrado
 *
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [occurrenceDate]
 *         description: Campo utilizado para ordenação
 *
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordem da listagem
 *
 *     responses:
 *       200:
 *         description: Lista de objetos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   photoUrl:
 *                     type: string
 *                     nullable: true
 *                   location:
 *                     type: string
 *                   occurrenceDate:
 *                     type: string
 *                     format: date-time
 *                   type:
 *                     type: string
 *                     enum: [LOST, FOUND]
 *                   status:
 *                     type: string
 *                     enum: [OPEN, RESOLVED]
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: Token inválido ou não informado.
 *       500:
 *         description: Erro interno do servidor.
 */
itemRoute.get(
  "/",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  itemController.getAll,
);

/**
 * @swagger
 * /item/me:
 *   get:
 *     summary: Lista todos os anúncios do usuário autenticado
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de anúncios do usuário retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   photoUrl:
 *                     type: string
 *                     nullable: true
 *                   location:
 *                     type: string
 *                   occurrenceDate:
 *                     type: string
 *                     format: date-time
 *                   type:
 *                     type: string
 *                     enum: [LOST, FOUND]
 *                   status:
 *                     type: string
 *                     enum: [OPEN, RESOLVED]
 *                   category:
 *                     type: object
 *                   user:
 *                     type: object
 *       401:
 *         description: Token inválido ou não informado.
 *       500:
 *         description: Erro interno do servidor.
 */
itemRoute.get(
  "/me",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  itemController.getMyItems,
);

/**
 * @swagger
 * /item/{id}:
 *   get:
 *     summary: Busca um objeto pelo ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do objeto
 *     responses:
 *       200:
 *         description: Objeto encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 photoUrl:
 *                   type: string
 *                   nullable: true
 *                 location:
 *                   type: string
 *                 occurrenceDate:
 *                   type: string
 *                   format: date-time
 *                 type:
 *                   type: string
 *                   enum: [LOST, FOUND]
 *                 status:
 *                   type: string
 *                   enum: [OPEN, RESOLVED]
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: Token inválido ou não informado.
 *       404:
 *         description: Objeto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
itemRoute.get(
  "/:id",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  itemController.getById,
);

/**
 * @swagger
 * /item/{id}:
 *   patch:
 *     summary: Atualiza um objeto
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do objeto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mochila preta atualizada
 *               description:
 *                 type: string
 *                 example: Atualização da descrição do objeto
 *               photoUrl:
 *                 type: string
 *                 nullable: true
 *                 example: https://meusite.com/uploads/nova-foto.jpg
 *               categoryId:
 *                 type: string
 *                 example: 6c8f17cf-7f5c-4cf3-a7f0-6f0eec1d6e6d
 *               location:
 *                 type: string
 *                 example: Bloco C - Sala 05
 *               occurrenceDate:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [LOST, FOUND]
 *               status:
 *                 type: string
 *                 enum: [OPEN, RESOLVED]
 *     responses:
 *       200:
 *         description: Objeto atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Objeto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
itemRoute.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  itemController.update,
);

/**
 * @swagger
 * /item/{id}/resolve:
 *   patch:
 *     summary: Marca um objeto como resolvido
 *     description: Atualiza o status do objeto para RESOLVED quando ele foi recuperado ou entregue ao dono.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do objeto
 *     responses:
 *       200:
 *         description: Objeto marcado como resolvido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [RESOLVED]
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Objeto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
itemRoute.patch(
  "/:id/resolve",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  itemController.resolve,
);

/**
 * @swagger
 * /item/{id}:
 *   delete:
 *     summary: Remove um objeto
 *     description: Remove permanentemente um objeto do sistema. Apenas administradores podem executar esta ação.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do objeto
 *     responses:
 *       200:
 *         description: Objeto removido com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Objeto deletado com sucesso
 *       401:
 *         description: Token inválido ou não informado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Objeto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
itemRoute.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  itemController.remove,
);

module.exports = itemRoute;
