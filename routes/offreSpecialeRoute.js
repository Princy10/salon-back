const express = require('express');
const { createOffreSpeciale } = require('../controllers/offreSpecialeController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create', checkManagerRole, createOffreSpeciale);

module.exports = router;