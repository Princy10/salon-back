const express = require('express');
const { getPreferenceEmpl, getPreferenceIdClient, getPreferenceEmployerByIdClient } = require('../controllers/preferenceEmplController');

const router = express.Router();

router.get('/list', getPreferenceEmpl);
router.get('/list/:id', getPreferenceIdClient);
router.get('/liste/:id', getPreferenceEmployerByIdClient);

module.exports = router;