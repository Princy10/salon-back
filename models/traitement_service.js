const mongoose = require("mongoose");

const traitementServiceSchema = mongoose.Schema(
  {
    id_traitement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traitement',
      required: true
    },
    id_service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

const traitementService = mongoose.model("TraitementService", traitementServiceSchema);

module.exports = traitementService;