const express = require("express");
const { getStats, exportExcel } = require("../controllers/statsController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

const statsRoute = express.Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Retorna as estatísticas agregadas da plataforma (somente ADMIN)
 *     tags:
 *       - Estatísticas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *       401:
 *         description: Token inválido ou não informado
 *       403:
 *         description: Acesso negado
 */
statsRoute.get("/", authMiddleware, authorizeRoles("ADMIN"), getStats);

/**
 * @swagger
 * /stats/export:
 *   get:
 *     summary: Exporta um relatório completo em Excel (.xlsx) (somente ADMIN)
 *     tags:
 *       - Estatísticas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Arquivo .xlsx gerado com sucesso
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token inválido ou não informado
 *       403:
 *         description: Acesso negado
 */
statsRoute.get("/export", authMiddleware, authorizeRoles("ADMIN"), exportExcel);

module.exports = statsRoute;
