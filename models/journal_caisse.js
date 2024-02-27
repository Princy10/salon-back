const mongoose = require('mongoose');

const journalCaisseSchema = mongoose.Schema(
    {
        id_individu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Individu'
        },
        type_mouvement: {
            type: String,
            required: true
        },
        date_heure: {
            type: Date,
            required: true
          },
        montant: {
            type: Number,
            required: true
        },
        libeller_journal: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const journalCaisse = mongoose.model('JournalCaisse', journalCaisseSchema);

module.exports = journalCaisse;