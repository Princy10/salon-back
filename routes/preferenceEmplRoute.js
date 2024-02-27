const express = require('express');
const { getPreferenceEmpl, getPreferenceIdClient } = require('../controllers/preferenceEmplController');

const router = express.Router();

router.get('/list', getPreferenceEmpl);
router.get('/list/:id', getPreferenceIdClient);

module.exports = router;