const express = require('express');
const { insererRdvEtServices, getRdvEmplByID, getRdvByID, etatRdvValider, etatRdvRefuser, getRdvClientByID, etatRdvAnnuler, insererpreferenceRdv } = require('../controllers/priseRdvController');

const router = express.Router();

router.post('/create', insererRdvEtServices);
router.post('/createPreference', insererpreferenceRdv);
router.get('/list/:id', getRdvEmplByID);
router.get('/listRdvById/:id', getRdvByID);
router.put('/update_valider/:id', etatRdvValider);
router.put('/update_refuser/:id', etatRdvRefuser);
// client rdv
router.get('/listRdv_client/:id', getRdvClientByID);
router.put('/update_annuler/:id', etatRdvAnnuler);

module.exports = router;