const express = require('express');
const { statReserv, statChiffreAffaire, statBenefice } = require('../controllers/statController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/reservation', checkManagerRole, statReserv);
router.get('/chiffre-affaire', checkManagerRole, statChiffreAffaire);
router.get('/benefice', checkManagerRole, statBenefice);

module.exports = router;