const mongoose = require('mongoose');

const individuSchema = mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Enter a last name'],
    },
    prenom: {
      type: String,
      required: [true, 'Enter a first name'],
    },
    date_naissance: {
      type: Date,
      required: [true, 'Enter a date of birth'],
    },
    contact: {
      type: String,
      required: [true, 'Enter a contact number'],
    },
    adresse: {
      type: String,
      required: [true, 'Enter an address'],
    },
    mail: {
      type: String,
      required: [true, 'Enter an email address'],
    },
    cin: {
      type: String,
      required: [true, 'Enter a National Identity Card number'],
    },
  },
  {
    timestamps: true,
  }
);

const Individu = mongoose.model('Individu', individuSchema);

module.exports = Individu;