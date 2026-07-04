const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Configuração básica do CORS (o proxy reverso compartilha a mesma origem em produção)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
