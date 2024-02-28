const asyncHandler = require('express-async-handler')
const Traitement = require('../models/traitement')
const TraitementService = require('../models/traitement_service')
const Rdv = require('../models/rdv');
const Rdv_service = require('../models/rdv_service');
const Portefeuille = require('../models/portefeuille')
const JournalCaisse = require('../models/journal_caisse')
const OffreSpeciale = require('../models/offre_speciale');
const Service = require('../models/services')



const createTraitement = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const rdv = await Rdv.findById(id);
  
      const { _id } = req.body;
  
      const traitement = new Traitement({
        _id,
        id_individu_client: rdv.id_individu_client,
        id_individu_empl: rdv.id_individu_empl,
        date_heure: new Date(),
      });
  
      const traitementEnregistre = await traitement.save();
  
      const rdvServices = await Rdv_service.find({ id_rdv: id });
  
      for (const rdvService of rdvServices) {
        const traitementService = new TraitementService({
          id_traitement: traitementEnregistre._id,
          id_service: rdvService.id_service,
        });
  
        await traitementService.save();
      }
  
      res.status(201).json({ traitementEnregistre });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const getTraitementByID = asyncHandler(async(req, res) => {
    try {
      const {id, idRdv} = req.params;
      const traitement = await Traitement.findById(id)
        .populate('id_individu_client', 'nom prenom')
        .populate('id_individu_empl', 'nom prenom');
  
      if (!traitement) {
        res.status(404);
        throw new Error('Rendez-vous not found');
      }
  
      const traitementService = await TraitementService.find({ id_traitement: traitement._id }).populate('id_service');
      const rdv = await Rdv.findById(idRdv);

      let totalPrix = 0;
      let prixOffre = 0;
      for (const traitementServ of traitementService) {
        const service = traitementServ.id_service;
        const offreSpeciale = await OffreSpeciale.findOne({
          id_service: service._id,
          date_debut: { $lte: new Date() },
          date_fin: { $gte: new Date() },
        });

        if (offreSpeciale && offreSpeciale.date_fin >= rdv.date_heure) {
          prixOffre = offreSpeciale.prix;
          totalPrix += offreSpeciale.prix;
        } else {
          totalPrix += service.prix;
        }
      }
      
      const response = {
        _id: traitement._id,
        id_individu_client: traitement.id_individu_client,
        id_individu_empl: traitement.id_individu_empl,
        date_heure: traitement.date_heure,
        services: traitementService.map(traitementService => traitementService.id_service),
        totalPrix: totalPrix,
        offreSpecialePrix: prixOffre,
      };
  
      res.status(200).json(response);
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }
  });



  const payerDepuisPortefeuille = asyncHandler(async (req, res) => {
    try {
        const { id, id_rdv, montant } = req.body;

        const rdv1 = await Rdv.findById(id_rdv);

        const portefeuille = await Portefeuille.findOne({ id_individu: id });
        const portefeuilleEmplyer = await Portefeuille.findOne({ id_individu: rdv1.id_individu_empl });
        
        if (!portefeuille) {
            return res.status(404).json({ message: 'Portefeuille introuvable' });
        }

        if (portefeuille.solde < montant) {
            return res.status(400).json({ message: 'Solde insuffisant' });
        }

        const rdvService = await Rdv_service.findOne({ id_rdv: id_rdv });
        const service = await Service.findById(rdvService.id_service);

        if (!service) {
            return res.status(404).json({ message: 'Service introuvable' });
        }

        let prixService = service.prix;
        const offreSpeciale = await OffreSpeciale.findOne({ id_service: service._id, date_debut: { $lte: new Date() }, date_fin: { $gte: new Date() } });
        if (offreSpeciale) {
            prixService = offreSpeciale.prix;
        }

        const commission = prixService * (service.commission / 100);
        const resteMontantService = prixService - commission;
        const montantEmploye = prixService - resteMontantService;

        portefeuilleEmplyer.solde += montantEmploye;
        await portefeuilleEmplyer.save();

        portefeuille.solde -= montant;
        await portefeuille.save();

        const payerEmployer = new JournalCaisse({
            id_individu: rdv1.id_individu_empl,
            type_mouvement: 'Débit',
            date_heure: new Date(),
            montant: montantEmploye,
            libeller_journal: 'Paiement salaire employé'
        });

        const payerEmployerEnregistre = await payerEmployer.save();

        const payer = new JournalCaisse({
            id_individu: id,
            type_mouvement: 'Crédit',
            date_heure: new Date(),
            montant: resteMontantService,
            libeller_journal: 'Paiement des services'
        });

        const payerServiceEnregistre = await payer.save();

        const rdv = await Rdv.findById(id_rdv);
        if (!rdv) {
            return res.status(404).json({ message: 'Rendez-vous introuvable' });
        }
        rdv.etat = 'fin';
        await rdv.save();

        return res.status(200).json({ message: 'Paiement effectué avec succès', portefeuille });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors du paiement' });
    }
});

const calculerCommissionJournee = asyncHandler(async (req, res) => {
  const { date, idEmploye  } = req.body;
  try {
    let dateDebut = new Date(date);
    dateDebut.setHours(0, 0, 0, 0); 
    let dateFin = new Date(date);
    dateFin.setHours(23, 59, 59, 999);

    const rdvs = await Rdv.find({ 
      date_heure: { $gte: dateDebut, $lte: dateFin },
      id_individu_empl: idEmploye
  });
      let commissionTotal = 0;

      for (const rdv of rdvs) {
          const rdvServices = await Rdv_service.find({ id_rdv: rdv._id });
          for (const rdvService of rdvServices) {
              const service = await Service.findById(rdvService.id_service);
              if (service) {
                  const commission = service.prix * (service.commission / 100);
                  commissionTotal += commission;
              }
          }
      }

      return res.status(200).json({ commissionTotal });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors du calcul de la commission pour la journée' });
  }
});

module.exports = {
    createTraitement,
    getTraitementByID,
    payerDepuisPortefeuille,
    calculerCommissionJournee
  };