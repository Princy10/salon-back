const mongoose = require("mongoose");

const preferenceEmployerSchema = mongoose.Schema(
  {
    id_client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individu',
        required: true
    },
    id_employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individu',
        required: true
    },
      nombre_rdv: {
        type: Number,
        required: true,
        default: 0
    }
  },
  {
    timestamps: true,
  }
);

const preferenceEmployer = mongoose.model("preferenceEmployer", preferenceEmployerSchema);

module.exports = preferenceEmployer;
