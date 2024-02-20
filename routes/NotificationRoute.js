const express = require('express');
const { getNotification, getNotificationByID } = require('../controllers/notificationController');

const router = express.Router();

router.get('/liste',  getNotification);
router.get('/list/:id', getNotificationByID);

module.exports = router;