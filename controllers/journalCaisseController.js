const JournalCaisse = require('../models/journal_caisse')
const asyncHandler = require('express-async-handler')
const Portefeuille = require('../models/portefeuille')


const createDepense = asyncHandler(async(req, res) => {
    try {
        const depense = await JournalCaisse.create(req.body)
        res.status(200).json(depense);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const paiementSalaire = asyncHandler(async(req, res) => {
    try {
        const { id_individu, type_mouvement, date_heure, montant, libeller_journal } = req.body;
  
        const salaire = new JournalCaisse({
          id_individu,
          type_mouvement,
          date_heure,
          montant,
          libeller_journal
        });
    
        const paiementEnregistre = await salaire.save();
        
        await ajouterMontantAuSolde(paiementEnregistre.id_individu, paiementEnregistre.montant);
    
        res.status(201).json({ message: 'depot avec succès' });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const ajouterMontantAuSolde = async (id_individu, montant) => {
    try {
      const portefeuille = await Portefeuille.findOne({ id_individu });
  
      portefeuille.solde += montant;
  
      await portefeuille.save();
    } catch (error) {
      console.error(error);
      throw new Error('Erreur lors de la mise à jour du solde du portefeuille');
    }
  };


const getJournal_caisse = asyncHandler(async(req, res) => {
    try {
        const journal = await JournalCaisse.find({}).populate('id_individu', 'nom prenom');
        res.status(200).json(journal);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})

const calculerBeneficePerte = asyncHandler(async (req, res) => {
    const { dateDebut, dateFin } = req.body;

    if (!dateDebut || !dateFin || isNaN(Date.parse(dateDebut)) || isNaN(Date.parse(dateFin))) {
        return res.status(400).json({ message: 'Les dates de début et de fin sont requises et doivent être des dates valides.' });
    }

    const mouvements = await JournalCaisse.find({
        date_heure: { $gte: new Date(dateDebut), $lte: new Date(dateFin + 'T23:59:59.999Z') }
    });
    

    let totalDepense = 0;
    let totalGain = 0;

    mouvements.forEach(mouvement => {
        if (mouvement.type_mouvement.toLowerCase() === 'débit') {
            totalDepense += mouvement.montant;
        } else if (mouvement.type_mouvement.toLowerCase() === 'crédit') {
            totalGain += mouvement.montant;
        }
    });

    const beneficePerte = totalGain - totalDepense;

    return res.json({ totalDepense, totalGain, beneficePerte });
});

const getJournalById_individu = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const journal = await JournalCaisse.find({ id_individu: id}).populate('id_individu', 'nom prenom');
  
        res.status(200).json(journal);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
  });

module.exports = {
    createDepense,
    getJournal_caisse,
    paiementSalaire,
    calculerBeneficePerte,
    getJournalById_individu
  };