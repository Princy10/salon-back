const mongoose = require('mongoose');

const fonction = mongoose.Schema(
    {
        code_fonction: {
            type: String,
            required: true
        },
        libelle: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const Fonction = mongoose.model('Fonction', fonction);

module.exports = Fonction;