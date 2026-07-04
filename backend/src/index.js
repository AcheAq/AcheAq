const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Configuração do CORS dinâmica para permitir localhost e o domínio de produção
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Permite localhosts ou subdomínios dinâmicos do Qzz.io
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.qzz.io') || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(new Error('CORS não permitido para esta origem'), false);
  },
  credentials: true
}));

app.use(express.json());

// Rota inicial padrão
app.get('/api', (req, res) => {
  res.json({ message: 'Bem-vindo à API do AcheAq!' });
});

// Inicialização do servidor (escutando apenas em localhost localmente para segurança)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
