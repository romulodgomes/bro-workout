require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./routes/users");
const exercicioRoutes = require("./routes/exercicios");

connectDB();
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

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
});
