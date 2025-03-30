const mongoose = require("mongoose");

const SerieSchema = new mongoose.Schema({
    exercicio: { type: mongoose.Schema.Types.ObjectId, ref: "Exercicio" },
    repeticoes: { type: Number },
    execucoes: { type: Number },
    carga: { type: Number }
});

const TreinoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    series: [SerieSchema],
});

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    treinos: [TreinoSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);