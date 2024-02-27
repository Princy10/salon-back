const Depot = require('../models/depot')
const Portefeuille = require('../models/portefeuille')
const asyncHandler = require('express-async-handler')

const insererDepot = asyncHandler(async (req, res) => {
    try {
      const { id_individu, date_depot, montant } = req.body;
  
      const nouveauDepot = new Depot({
        id_individu,
        date_depot,
        montant
      });
  
      const depotEnregistre = await nouveauDepot.save();
      
      await ajouterMontantAuSolde(depotEnregistre.id_individu, depotEnregistre.montant);
  
      res.status(201).json({ message: 'depot avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de l\'enregistrement du dépôt' });
    }
});


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

module.exports = {
  insererDepot
}