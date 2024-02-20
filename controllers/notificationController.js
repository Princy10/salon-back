const Notification = require('../models/notification');
const asyncHandler = require('express-async-handler');

const getNotification = asyncHandler(async(req, res) => {
    try {
        const notifications = await Notification.find({})
            .populate('id_offre'); 

        const notificationsWithDetails = notifications.map(notification => {
            const { id_offre, ...rest } = notification.toJSON(); 
            return { ...rest, offreSpeciale: id_offre }; 
        });

        res.status(200).json(notificationsWithDetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const getNotificationByID = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const notif = await Notification.findById(id).populate({
            path: 'id_offre',
            populate: {
                path: 'id_service'
            }
        });
        res.status(200).json(notif);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})



module.exports = {
    getNotification,
    getNotificationByID
}