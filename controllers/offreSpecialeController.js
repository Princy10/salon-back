const OffreSpeciale = require('../models/offre_speciale');
const Notification = require('../models/notification');
const asyncHandler = require('express-async-handler');



const createOffreSpeciale = asyncHandler(async(req, res) => {
    try {
        const offreSpec = await OffreSpeciale.create(req.body)

        const notificationData = {
            id_offre: offreSpec._id
        };
        const notification = await Notification.create(notificationData);

        res.status(200).json({ offreSpec, notification });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    createOffreSpeciale
}