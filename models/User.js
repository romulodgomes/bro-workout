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

const nonEmptyString = {
    validator: (value) => typeof value === "string" && value.trim().length > 0,
    message: "Campo não pode ser vazio",
};

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Nome é obrigatório"],
        validate: nonEmptyString,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email é obrigatório"],
        unique: true,
        trim: true,
        validate: {
            validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: "Email inválido",
        },
    },
    // required só em documento novo: select:false omitiria password em updates de treino
    password: {
        type: String,
        select: false,
        required: [
            function () {
                return this.isNew;
            },
            "Senha é obrigatória",
        ],
        validate: {
            validator: (value) =>
                value === undefined || (typeof value === "string" && value.trim().length > 0),
            message: "Senha não pode ser vazia",
        },
    },
    treinos: [TreinoSchema]
}, { timestamps: true });

const omitPassword = (_doc, ret) => {
    delete ret.password;
    return ret;
};

UserSchema.set("toJSON", { transform: omitPassword });
UserSchema.set("toObject", { transform: omitPassword });

module.exports = mongoose.model("User", UserSchema);