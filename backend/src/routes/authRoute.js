const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController.js");
const authRoute = express.Router();

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

authRoute.post("/forgot-password", forgotPassword);

authRoute.post("/reset-password", resetPassword);

module.exports = authRoute;
