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

// Rota GET - Buscar treinos de um usuário específico
router.get("/:userId/treinos", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: "treinos.series.exercicio",
      model: "Exercicio"
    });
    
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    
    res.json(user.treinos || []);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar treinos do usuário" });
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

// Rota PATCH - Editar um treino específico de um usuário
router.patch("/:userId/treinos/:treinoId", async (req, res) => {
  try {
    const { userId, treinoId } = req.params;
    const { nome, series } = req.body;

    // Buscar o usuário pelo ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Encontrar o índice do treino no array
    const treinoIndex = user.treinos.findIndex(
      treino => treino._id.toString() === treinoId
    );

    if (treinoIndex === -1) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }

    // Atualizar o treino
    if (nome) {
      user.treinos[treinoIndex].nome = nome;
    }
    if (series) {
      user.treinos[treinoIndex].series = series;
    }

    await user.save();

    // Buscar o usuário atualizado com os treinos populados
    const updatedUser = await User.findById(userId).populate({
      path: "treinos.series.exercicio",
      model: "Exercicio"
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar treino" });
    console.log(error);
  }
});

module.exports = router;