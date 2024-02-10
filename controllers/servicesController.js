const Service = require('../models/services')
const asyncHandler = require('express-async-handler')

const getServices = asyncHandler(async(req, res) => {
    try {
        const service = await Service.find({});
        res.status(200).json(service);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})

const getServiceByID = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const service = await Service.findById(id);
        res.status(200).json(service);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})

const createService = asyncHandler(async(req, res) => {
    try {
        const service = await Service.create(req.body)
        const io = req.app.get('io');
        io.emit('deleteServiceById');
        res.status(200).json(service);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const updateService = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const service = await Service.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!service){
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }
        const io = req.app.get('io');
        io.emit('updateServiceById', service);
        const updateService = await Service.findById(id);
        res.status(200).json(updateService);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const deleteService = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const service = await Service.findByIdAndDelete(id);
        if(!service){
            res.status(404);
            throw new Error(`cannot find any example with ID ${id}`);
        }
        const io = req.app.get('io');
        io.emit('deleteServiceById');
        res.status(200).json(service);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    getServices,
    getServiceByID,
    createService,
    updateService,
    deleteService
}