const Example = require('../models/example')
const asyncHandler = require('express-async-handler')

const getExamples = asyncHandler(async(req, res) => {
    try {
        const examples = await Example.find({});
        res.status(200).json(examples);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})

const getExampleByID = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const example = await Example.findById(id);
        res.status(200).json(example);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})

const createExample = asyncHandler(async(req, res) => {
    try {
        const example = await Example.create(req.body)
        res.status(200).json(example);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const updateExample = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const example = await Example.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!example){
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }
        const updatedExample = await Example.findById(id);
        res.status(200).json(updatedExample);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const deleteExample = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const example = await Example.findByIdAndDelete(id);
        if(!example){
            res.status(404);
            throw new Error(`cannot find any example with ID ${id}`);
        }
        res.status(200).json(example);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    getExamples,
    getExampleByID,
    createExample,
    updateExample,
    deleteExample
}