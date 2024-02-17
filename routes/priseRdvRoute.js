const express = require('express');
const { insererRdvEtServices, getRdvEmplByID, getRdvByID, etatRdvValider, etatRdvRefuser} = require('../controllers/priseRdvController');

const router = express.Router();

router.post('/create', insererRdvEtServices);
router.get('/list/:id', getRdvEmplByID);
router.get('/listRdvById/:id', getRdvByID);
router.put('/update_valider/:id', etatRdvValider);
router.put('/update_refuser/:id', etatRdvRefuser);

module.exports = router;