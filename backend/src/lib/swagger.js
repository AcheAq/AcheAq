const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AcheAq API",
      version: "1.0.0",
      description: "Documentação da API do AcheAq",
    },
    servers: [
      {
        url: "/api",
        description: "Servidor Atual (Produção/Preview)",
      },
      {
        url: "http://localhost:5000",
        description: "Servidor Local (Desenvolvimento)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
