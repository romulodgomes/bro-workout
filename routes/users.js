const express = require("express");
const User = require("../models/User");
const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCreateUser({ nome, email, password }) {
  const errors = [];

  if (nome === undefined || nome === null) {
    errors.push("Nome é obrigatório");
  } else if (typeof nome !== "string") {
    errors.push("Nome deve ser uma string");
  } else if (nome.trim() === "") {
    errors.push("Nome não pode ser vazio");
  }

  if (email === undefined || email === null) {
    errors.push("Email é obrigatório");
  } else if (typeof email !== "string") {
    errors.push("Email deve ser uma string");
  } else if (email.trim() === "") {
    errors.push("Email não pode ser vazio");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Email inválido");
  }

  if (password === undefined || password === null) {
    errors.push("Senha é obrigatória");
  } else if (typeof password !== "string") {
    errors.push("Senha deve ser uma string");
  } else if (password.trim() === "") {
    errors.push("Senha não pode ser vazia");
  }

  return errors;
}

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
    const validationErrors = validateCreateUser({ nome, email, password });

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors[0], errors: validationErrors });
    }

    const newUser = new User({
      nome: nome.trim(),
      email: email.trim(),
      password: password.trim(),
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message)[0] || "Dados inválidos";
      return res.status(400).json({ error: message });
    }
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

// Rota DELETE - Excluir um treino específico de um usuário
router.delete("/:userId/treinos/:treinoId", async (req, res) => {
  try {
    const { userId, treinoId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const treinoIndex = user.treinos.findIndex(
      treino => treino._id.toString() === treinoId
    );

    if (treinoIndex === -1) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }

    user.treinos.splice(treinoIndex, 1);
    await user.save();

    const updatedUser = await User.findById(userId).populate({
      path: "treinos.series.exercicio",
      model: "Exercicio"
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir treino" });
    console.log(error);
  }
});

module.exports = router;