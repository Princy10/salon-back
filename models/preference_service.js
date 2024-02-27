const mongoose = require("mongoose");

const preferenceServiceSchema = mongoose.Schema(
  {
    id_client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individu',
        required: true
    },
    id_service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
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

const preferenceService = mongoose.model("preferenceService", preferenceServiceSchema);

module.exports = preferenceService;
