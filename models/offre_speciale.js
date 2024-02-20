const mongoose = require('mongoose');

const offreSpeciale = mongoose.Schema(
    {
        id_service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        date_debut: {
            type: Date,
            required: true,
        },
        date_fin: {
            type: Date,
            required: true,
        },
        prix: {
            type: Number,
            required: true
        },
        titre: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const Offre_speciale = mongoose.model('Offre_speciale', offreSpeciale);

module.exports = Offre_speciale;