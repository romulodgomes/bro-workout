const mongoose = require("mongoose");

const ExercicioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  video: { type: String, required: false },
  imagem: { type: String, required: false },
});

module.exports = mongoose.model("Exercicio", ExercicioSchema);