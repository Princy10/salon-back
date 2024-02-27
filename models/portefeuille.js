const mongoose = require('mongoose');

const portefeuilleSchema = mongoose.Schema(
  {
    id_individu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individu'
    },
    solde: {
        type: Number,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const portefeuille = mongoose.model('Portefeuille', portefeuilleSchema);

module.exports = portefeuille;