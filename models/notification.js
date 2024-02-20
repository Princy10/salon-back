const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        id_offre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Offre_speciale",
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const notification = mongoose.model('Notification', notificationSchema);

module.exports = notification;