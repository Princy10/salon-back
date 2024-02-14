const Rdv = require('../models/rdv');
const Rdv_service = require('../models/rdv_service');
const asyncHandler = require('express-async-handler');

const insererRdvEtServices = asyncHandler(async (req, res) => {
  try {
    const { id_individu_client, id_individu_empl, date_heure, etat, services } = req.body;

    const nouveauRdv = new Rdv({
      id_individu_client,
      id_individu_empl,
      date_heure,
      etat
    });

    const rdvEnregistre = await nouveauRdv.save();

    for (const id_service of services) {
      const nouveauRdvService = new Rdv_service({
        id_rdv: rdvEnregistre._id,
        id_service
      });
      await nouveauRdvService.save();
    }

    res.status(201).json({ message: 'Rendez-vous et services enregistrés avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de enregistrement du rendez-vous et des services' });
  }
});

module.exports = {
  insererRdvEtServices
};