require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/users");
const exercicioRoutes = require("./routes/exercicios");
const { setupSwagger } = require("./swagger");

connectDB();
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
setupSwagger(app);

// Usando as rotas
app.use("/users", userRoutes);
app.use("/exercicios", exercicioRoutes);
// Rota principal
app.get("/", (req, res) => {
  res.send("🚀 API rodando com Express!");
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${port}`);
  console.log(`📄 Swagger em http://localhost:${port}/api-docs`);
});
