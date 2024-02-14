const express = require('express');
const { insererRdvEtServices } = require('../controllers/priseRdvController');

const router = express.Router();

router.post('/create', insererRdvEtServices);

module.exports = router;