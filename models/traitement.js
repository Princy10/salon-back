const mongoose = require("mongoose");

const traitemenSchema = mongoose.Schema(
  {
    id_individu_client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Individu',
      required: true
    },
    id_individu_empl: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Individu',
      required: true
    },
    date_heure: {
      type: Date,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const traitement = mongoose.model("Traitement", traitemenSchema);

module.exports = traitement;