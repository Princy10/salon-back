const express = require('express');
const { createDepense, getJournal_caisse, paiementSalaire, calculerBeneficePerte } = require('../controllers/journalCaisseController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/list', getJournal_caisse);
router.post('/create', checkManagerRole, createDepense);
router.post('/createPaiement', checkManagerRole, paiementSalaire);
router.post('/calcul_Benef_Perte',  calculerBeneficePerte);


module.exports = router;