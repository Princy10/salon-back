const mongoose = require('mongoose');

const emploisSchema = mongoose.Schema(
  {
    id_individu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individu'
    },
    code_fonction: {
      type: String,
      ref: 'Fonction',
      required: [true, 'Enter a code function'],
    },
    salaire: {
      type: String,
      required: [true, 'Enter a salary'],
    },
    date_debut: {
      type: Date,
      required: [true, 'Enter a start date'],
    },
    date_fin: {
      type: Date,
      required: [true, 'Enter a date finish'],
    },
    heure_travail: {
      type: Number,
      required: [true, 'Enter a work hour'],
    },
  },
  {
    timestamps: true,
  }
);

const Emploi = mongoose.model('Emploi', emploisSchema);

module.exports = Emploi;