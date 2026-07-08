const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController.js");
const authRoute = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - registration
 *               - course
 *               - institution
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               phone:
 *                 type: string
 *                 example: "(82) 99999-9999"
 *               registration:
 *                 type: string
 *                 example: "2023001234"
 *               course:
 *                 type: string
 *                 example: "Ciência da Computação"
 *               institution:
 *                 type: string
 *                 example: "IFAL"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
authRoute.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 550e8400-e29b-41d4-a716
 *                     name:
 *                       type: string
 *                       example: João Silva
 *                     email:
 *                       type: string
 *                       example: joao@email.com
 *                     phone:
 *                       type: string
 *                       example: "(82) 99999-9999"
 *                     studentRegistration:
 *                       type: string
 *                       example: "2023001234"
 *                     course:
 *                       type: string
 *                       example: "Ciência da Computação"
 *                     institution:
 *                       type: string
 *                       example: "IFAL"
 *                     role:
 *                       type: string
 *                       example: USER
 *       401:
 *         description: Credenciais inválidas
 */
authRoute.post("/login", login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicita recuperação de senha
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *     responses:
 *       200:
 *         description: Solicitação processada. Caso o e-mail exista, um link de recuperação será enviado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se o e-mail estiver cadastrado, você receberá um link de recuperação.
 *       400:
 *         description: Dados inválidos
 */
authRoute.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Redefine a senha do usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: 8c5b82876b601b5303fe4fe4ddadfb87f36a8814820ee9f97e5626fea2f64c67
 *               password:
 *                 type: string
 *                 example: novaSenha123
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Senha atualizada com sucesso.
 *       400:
 *         description: Token inválido, expirado ou dados inválidos
 */
authRoute.post("/reset-password", resetPassword);

authRoute.patch(
  "/change-password",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  changePassword,
);

module.exports = authRoute;
