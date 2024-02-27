const Portefeuille = require('../models/portefeuille')
const asyncHandler = require('express-async-handler')


const portefeuille_ByIndividu = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const portefeuille = await Portefeuille.find({ id_individu: id });
  
        res.status(200).json(portefeuille);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
  })

const createportefeuille = asyncHandler(async(req, res) => {
    try {
        const portefeuille = await Portefeuille.create(req.body)
        res.status(200).json(portefeuille);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    portefeuille_ByIndividu,
    createportefeuille
  };