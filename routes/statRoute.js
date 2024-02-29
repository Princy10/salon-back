const express = require('express');
const { statReserv, statChiffreAffaire, statBenefice, statTempsMoyenTravail } = require('../controllers/statController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/reservation', checkManagerRole, statReserv);
router.get('/chiffre-affaire', checkManagerRole, statChiffreAffaire);
router.get('/benefice', checkManagerRole, statBenefice);
router.get('/temps-travail', checkManagerRole, statTempsMoyenTravail);

module.exports = router;