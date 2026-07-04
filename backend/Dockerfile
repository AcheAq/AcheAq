FROM node:20-alpine

# Instala o openssl para compatibilidade com o motor do Prisma no Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia a pasta prisma para gerar o cliente do banco de dados
COPY prisma ./prisma/
RUN npx prisma generate

# Copia o restante dos arquivos do backend
COPY . .

# Expõe a porta que o backend escutará
EXPOSE 5000

# Executa o script de inicialização que cuida das migrações e do boot do servidor
RUN chmod +x start.sh
CMD ["./start.sh"]
