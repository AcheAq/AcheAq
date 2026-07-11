# AcheAq - Plataforma de Achados e Perdidos

AcheAq é uma plataforma moderna de Achados e Perdidos projetada especificamente para instituições de ensino (escolas e faculdades). Ela ajuda estudantes, professores e funcionários a cadastrar, gerenciar e localizar itens perdidos e encontrados de forma rápida e segura.

---

## 🚀 Como Iniciar o Projeto

O projeto é dividido em duas partes: **Frontend** (Vite + React) e **Backend** (Node.js + Express + Prisma + PostgreSQL). Toda a infraestrutura está dockerizada para facilitar a inicialização.

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* [Node.js](https://nodejs.org/) (opcional, apenas se quiser executar o dev server local do frontend)

---

## 🛠️ Executando com Docker Compose (Tudo no Docker)

Esta é a forma mais rápida de subir o ecossistema completo com banco de dados, backend e frontend compilado para produção rodando no Nginx.

1. Na raiz do projeto, execute o comando para construir e iniciar os contêineres:
   ```bash
   docker compose up -d --build
   ```
2. O sistema estará disponível nas seguintes portas:
   * **Frontend (Aplicação Web):** [http://localhost:3000](http://localhost:3000)
   * **Backend API:** [http://localhost:5000](http://localhost:5000)
   * **Documentação da API (Swagger):** [http://localhost:3000/api/api-docs/](http://localhost:3000/api/api-docs/)

---

## 💻 Ambiente de Desenvolvimento Local (Frontend Hot Reload)

Para realizar alterações em tempo real no frontend com o servidor de desenvolvimento do Vite (Hot Reload):

1. **Inicie o Banco de Dados e o Backend no Docker:**
   ```bash
   # Sobe apenas o banco e o backend
   docker compose up -d db backend
   ```
2. **Execute o Frontend localmente:**
   ```bash
   # Navegue até a pasta do frontend
   cd frontend
   
   # Instale as dependências
   npm install
   
   # Inicie o servidor do Vite
   npm run dev
   ```
3. A aplicação de desenvolvimento estará disponível em:
   * **Frontend Dev Server:** [http://localhost:3000](http://localhost:3000) (ou na porta mostrada no terminal, caso haja conflito)

---

## ⚙️ Variáveis de Ambiente (.env)

### Frontend (`/frontend/.env`)
* `VITE_API_URL`: A rota base da API. No ambiente de desenvolvimento local, deve ser definida como `/api` para acionar a rota de proxy do Vite.
  ```env
  VITE_API_URL=/api
  ```

### Backend (`/backend/.env`)
* `DATABASE_URL`: String de conexão com o banco de dados PostgreSQL.
* `BACKEND_PORT`: Porta interna que o servidor Node executa (padrão: `5000`).
* `JWT_SECRET`: Chave secreta de geração dos tokens de autenticação.
* `FRONTEND_URL`: URL correspondente ao frontend para liberação de CORS.

---

## 📂 Estrutura do Projeto

* **/frontend:** Código-fonte da aplicação React, estilos CSS customizados baseados no Figma (`Inter`, gradientes, cards responsivos) e serviços de API com Axios.
* **/backend:** Servidor Express com mapeamento de rotas de autenticação, usuários, categorias, e lógica de negócios integrada ao banco de dados com Prisma ORM.
* **/docker-compose.yml:** Arquivo de orquestração de contêineres contendo o banco de dados PostgreSQL, backend Node e o proxy reverso Nginx empacotado no frontend.