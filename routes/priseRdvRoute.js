const express = require('express');
const { insererRdvEtServices, getRdvEmplByID, getRdvByID, etatRdvValider, etatRdvRefuser, getRdvClientByID, etatRdvAnnuler, insererpreferenceRdv, getRdvEmplByIDEtat, updatePreferences } = require('../controllers/priseRdvController');

const router = express.Router();

router.post('/create', insererRdvEtServices);
router.post('/createPreference', insererpreferenceRdv);
router.get('/list/:id', getRdvEmplByID);
router.get('/listByEtat/:id', getRdvEmplByIDEtat);
router.get('/listRdvById/:id', getRdvByID);
router.put('/update_valider/:id', etatRdvValider);
router.put('/update_refuser/:id', etatRdvRefuser);
// client rdv
router.get('/listRdv_client/:id', getRdvClientByID);
router.put('/update_annuler/:id', etatRdvAnnuler);
router.put('/update_preference/:id_client/:id_employer/:id_service', updatePreferences);

module.exports = router;