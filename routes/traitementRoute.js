const express = require('express');
const { createTraitement, getTraitementByID, payerDepuisPortefeuille, calculerCommissionJournee } = require('../controllers/traitementController');

const router = express.Router();

router.post('/create/:id',  createTraitement);
router.get('/list/:id/:idRdv', getTraitementByID);
router.post('/payer',  payerDepuisPortefeuille);
router.post('/commission-journee', calculerCommissionJournee);

module.exports = router;