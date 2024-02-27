const mongoose = require('mongoose');

const depotSchema = mongoose.Schema(
  {
    id_individu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individu'
    },
    date_depot: {
      type: Date,
      required: [true, 'Enter a start date'],
    },
    montant: {
        type: Number,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Depot = mongoose.model('Depot', depotSchema);

module.exports = Depot;