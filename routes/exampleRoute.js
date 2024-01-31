const express = require('express');
const Example = require('../models/example')
const {getExamples, getExampleByID, createExample, updateExample, deleteExample} = require('../controllers/exampleController')

const router = express.Router();

router.get('/list', getExamples);

router.get('/list/:id', getExampleByID);

router.post('/create/', createExample);

router.put('/update/:id', updateExample);

router.delete('/delete/:id', deleteExample);

module.exports = router;