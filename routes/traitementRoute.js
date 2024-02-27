const express = require('express');
const { createTraitement, getTraitementByID, payerDepuisPortefeuille } = require('../controllers/traitementController');

const router = express.Router();

router.post('/create/:id',  createTraitement);
router.get('/list/:id/:idRdv', getTraitementByID);
router.post('/payer',  payerDepuisPortefeuille);

module.exports = router;