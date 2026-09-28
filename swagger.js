const swaggerUi = require("swagger-ui-express");

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Bro Workout API",
    version: "1.0.0",
    description: "API de usuários, treinos e exercícios.",
  },
  servers: [
    {
      url: "http://localhost:{port}",
      variables: {
        port: {
          default: process.env.PORT || "3000",
        },
      },
    },
  ],
  tags: [
    { name: "Usuários", description: "Cadastro e listagem de usuários" },
    { name: "Treinos", description: "Treinos vinculados a um usuário" },
    { name: "Exercícios", description: "Catálogo de exercícios" },
  ],
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Usuário não encontrado" },
        },
      },
      Exercicio: {
        type: "object",
        properties: {
          _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
          nome: { type: "string", example: "Supino reto" },
          video: { type: "string", example: "https://example.com/supino.mp4" },
          imagem: { type: "string", example: "https://example.com/supino.jpg" },
        },
      },
      ExercicioInput: {
        type: "object",
        required: ["nome"],
        properties: {
          nome: { type: "string", example: "Supino reto" },
          video: { type: "string", example: "https://example.com/supino.mp4" },
          imagem: { type: "string", example: "https://example.com/supino.jpg" },
        },
      },
      Serie: {
        type: "object",
        properties: {
          exercicio: { type: "string", description: "ObjectId do exercício" },
          repeticoes: { type: "number", example: 12 },
          execucoes: { type: "number", example: 3 },
          carga: { type: "number", example: 40 },
        },
      },
      SeriePopulada: {
        type: "object",
        properties: {
          exercicio: { $ref: "#/components/schemas/Exercicio" },
          repeticoes: { type: "number", example: 12 },
          execucoes: { type: "number", example: 3 },
          carga: { type: "number", example: 40 },
        },
      },
      Treino: {
        type: "object",
        properties: {
          _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0e" },
          nome: { type: "string", example: "Peito e tríceps" },
          series: {
            type: "array",
            items: { $ref: "#/components/schemas/Serie" },
          },
        },
      },
      TreinoInput: {
        type: "object",
        required: ["nome"],
        properties: {
          nome: { type: "string", example: "Peito e tríceps" },
          series: {
            type: "array",
            items: { $ref: "#/components/schemas/Serie" },
          },
        },
      },
      TreinoUpdate: {
        type: "object",
        properties: {
          nome: { type: "string", example: "Peito e tríceps" },
          series: {
            type: "array",
            items: { $ref: "#/components/schemas/Serie" },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0f" },
          nome: { type: "string", example: "Ana Silva" },
          email: { type: "string", example: "ana@email.com" },
          password: { type: "string", example: "senha123" },
          treinos: {
            type: "array",
            items: { $ref: "#/components/schemas/Treino" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserInput: {
        type: "object",
        required: ["nome", "email"],
        properties: {
          nome: { type: "string", example: "Ana Silva" },
          email: { type: "string", example: "ana@email.com" },
          password: { type: "string", example: "senha123" },
        },
      },
    },
    parameters: {
      userId: {
        name: "userId",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "ID do usuário",
      },
      treinoId: {
        name: "treinoId",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "ID do treino",
      },
    },
  },
  paths: {
    "/": {
      get: {
        summary: "Status da API",
        responses: {
          200: {
            description: "API em execução",
            content: {
              "text/html": {
                schema: { type: "string", example: "🚀 API rodando com Express!" },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Usuários"],
        summary: "Listar usuários",
        description: "Retorna os usuários com os exercícios dos treinos populados.",
        responses: {
          200: {
            description: "Lista de usuários",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          500: {
            description: "Erro ao buscar usuários",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Usuários"],
        summary: "Criar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          500: {
            description: "Erro ao criar usuário",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/treinos": {
      get: {
        tags: ["Treinos"],
        summary: "Listar treinos do usuário",
        parameters: [{ $ref: "#/components/parameters/userId" }],
        responses: {
          200: {
            description: "Treinos do usuário",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Treino" },
                },
              },
            },
          },
          404: {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Erro ao buscar treinos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Treinos"],
        summary: "Adicionar treino ao usuário",
        parameters: [{ $ref: "#/components/parameters/userId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TreinoInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Treino adicionado. Retorna o usuário atualizado.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          404: {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Erro ao adicionar treino",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users/{userId}/treinos/{treinoId}": {
      patch: {
        tags: ["Treinos"],
        summary: "Editar um treino",
        parameters: [
          { $ref: "#/components/parameters/userId" },
          { $ref: "#/components/parameters/treinoId" },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TreinoUpdate" },
            },
          },
        },
        responses: {
          200: {
            description: "Treino atualizado. Retorna o usuário com exercícios populados.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          404: {
            description: "Usuário ou treino não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Erro ao editar treino",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Treinos"],
        summary: "Excluir um treino",
        parameters: [
          { $ref: "#/components/parameters/userId" },
          { $ref: "#/components/parameters/treinoId" },
        ],
        responses: {
          200: {
            description: "Treino excluído. Retorna o usuário atualizado.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          404: {
            description: "Usuário ou treino não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Erro ao excluir treino",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/exercicios": {
      get: {
        tags: ["Exercícios"],
        summary: "Listar exercícios",
        responses: {
          200: {
            description: "Lista de exercícios",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Exercicio" },
                },
              },
            },
          },
          500: {
            description: "Erro ao buscar exercícios",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Exercícios"],
        summary: "Criar exercício",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExercicioInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Exercício criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Exercicio" },
              },
            },
          },
          500: {
            description: "Erro ao criar exercício",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};

function setupSwagger(app) {
  app.get("/api-docs.json", (req, res) => {
    res.json(spec);
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
}

module.exports = { spec, setupSwagger };
