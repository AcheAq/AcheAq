#!/bin/sh

echo "Aguardando inicialização e migração do banco..."

# Executa o sincronismo do schema com o banco de dados PostgreSQL
npx prisma db push --accept-data-loss

echo "Iniciando o servidor backend..."
npm start
