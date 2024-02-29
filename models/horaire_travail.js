const mongoose = require("mongoose");

const Horaire_travailSchema = mongoose.Schema(
  {
    individu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Individu",
      required: true,
    },
    heure_debut: {
      type: String,
      required: true,
    },
    heure_fin: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Horaire_travail = mongoose.model("Horaire_travail", Horaire_travailSchema);

module.exports = Horaire_travail;