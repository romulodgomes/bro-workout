const express = require("express");
const Exercicio = require("../models/Exercicio");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const exercicios = await Exercicio.find();
        res.json(exercicios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

router.post("/", async (req, res) => {
  try {
    const { nome, video, imagem } = req.body;
    const newExercise = new Exercicio({ nome, video, imagem });
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar exercicio" });
    console.log(error);
  }
});

module.exports = router;