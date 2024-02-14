const mongoose = require("mongoose");

const rdv_serviceSchema = mongoose.Schema(
  {
    id_rdv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rdv",
      required: true,
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

const Rdv_service = mongoose.model("Rdv_service", rdv_serviceSchema);

module.exports = Rdv_service;
