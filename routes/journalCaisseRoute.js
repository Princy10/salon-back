const express = require('express');
const { createDepense, getJournal_caisse, paiementSalaire, calculerBeneficePerte, getJournalById_individu } = require('../controllers/journalCaisseController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/list', getJournal_caisse);
router.post('/create', checkManagerRole, createDepense);
router.post('/createPaiement', checkManagerRole, paiementSalaire);
router.post('/calcul_Benef_Perte',  calculerBeneficePerte);
router.get('/list/:id', getJournalById_individu);


module.exports = router;