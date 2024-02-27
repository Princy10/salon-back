const OffreSpeciale = require('../models/offre_speciale');
const Notification = require('../models/notification');
const asyncHandler = require('express-async-handler');



const createOffreSpeciale = asyncHandler(async(req, res) => {
    try {
        const offreSpec = await OffreSpeciale.create(req.body)

        const notificationData = {
            id_offre: offreSpec._id
        };
        const notification = await Notification.create(notificationData);

        res.status(200).json({ offreSpec, notification });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const getOffreSpecial = asyncHandler(async (req, res) => {
    try {
        const offres = await OffreSpeciale.find({}).populate('id_service');
        const offresWithServiceNames = offres.map(offre => ({
            ...offre.toObject(),
            service: offre.id_service.titre 
        }));
        res.status(200).json(offresWithServiceNames);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const getOffreSpecialByID = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const offre = await OffreSpeciale.findById(id);
        res.status(200).json(offre);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})

const updateOffreSpeciale = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const offre = await OffreSpeciale.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!offre){
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }
        const updateOffreSpeciale = await OffreSpeciale.findById(id);
        res.status(200).json(updateOffreSpeciale);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const deleteOffreSpecial = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const offrre = await OffreSpeciale.findByIdAndDelete(id);
        if(!offrre){
            res.status(404);
            throw new Error(`cannot find any example with ID ${id}`);
        }
        res.status(200).json(offrre);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    createOffreSpeciale,
    getOffreSpecial,
    getOffreSpecialByID,
    updateOffreSpeciale,
    deleteOffreSpecial
}