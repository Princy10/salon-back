const express = require('express');
const { getPreferenceservice, getPreferenceServiceByIdClient } = require('../controllers/preferenceServiceController');

const router = express.Router();

router.get('/list', getPreferenceservice);
router.get('/list/:id', getPreferenceServiceByIdClient);

module.exports = router;