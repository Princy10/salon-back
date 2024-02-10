const express = require('express');
const { ajout_employe } = require('../controllers/gestion_employeController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/ajout_empl', checkManagerRole, ajout_employe);

module.exports = router;