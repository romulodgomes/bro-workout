const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Rota GET - Listar usuários
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate({
      path: "treinos.series.exercicio", // Caminho para popular os exercícios
      model: "Exercicio" // Nome do modelo referenciado
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Rota POST - Criar usuário
router.post("/", async (req, res) => {
  try {
    const { nome, email, password } = req.body;
    const newUser = new User({ nome, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
    console.log(error);
  }
});

router.patch("/:userId/treinos", async (req, res) => {
  try {
    const { userId } = req.params;
    const { nome, series } = req.body;

    // Buscar o usuário pelo ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Criar o novo treino
    const novoTreino = { nome, series };
    user.treinos.push(novoTreino);

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar treino" });
  }
});


module.exports = router;