const mongoose = require("mongoose");

const rdvSchema = mongoose.Schema(
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
    etat: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Rdv = mongoose.model("Rdv", rdvSchema);

module.exports = Rdv;