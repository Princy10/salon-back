const Fonction = require('../models/fonction')
const asyncHandler = require('express-async-handler')

const getFonction = asyncHandler(async(req, res) => {
    try {
        const fonction = await Fonction.find({});
        res.status(200).json(fonction);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})


const createFonction = asyncHandler(async(req, res) => {
    try {
        const fonction = await Fonction.create(req.body)
        res.status(200).json(fonction);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})


module.exports = {
    getFonction,
    createFonction
}