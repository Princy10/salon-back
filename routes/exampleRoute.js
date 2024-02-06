const express = require('express');
const { getExamples, getExampleByID, createExample, updateExample, deleteExample } = require('../controllers/exampleController');
const { protect, checkEmployeeRole, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

router.get('/list', checkManagerRole, getExamples);

router.get('/list/:id', getExampleByID);
router.post('/create', createExample);
router.put('/update/:id', updateExample);
router.delete('/delete/:id', deleteExample);

module.exports = router;