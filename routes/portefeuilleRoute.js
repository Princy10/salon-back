const express = require('express');
const { portefeuille_ByIndividu, createportefeuille, } = require('../controllers/portefeuilleController');

const router = express.Router();

router.post('/create',  createportefeuille);
router.get('/list/:id', portefeuille_ByIndividu);

module.exports = router;