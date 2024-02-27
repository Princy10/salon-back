const express = require('express');
const { insererDepot } = require('../controllers/depotController');

const router = express.Router();

router.post('/create',  insererDepot);

module.exports = router;