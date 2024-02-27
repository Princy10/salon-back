const express = require('express');
const { createOffreSpeciale, getOffreSpecial, getOffreSpecialByID, updateOffreSpeciale, deleteOffreSpecial} = require('../controllers/offreSpecialeController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/list', getOffreSpecial);
router.get('/list/:id', checkManagerRole, getOffreSpecialByID);
router.post('/create', checkManagerRole, createOffreSpeciale);
router.put('/update/:id', checkManagerRole, updateOffreSpeciale);
router.delete('/delete/:id', checkManagerRole, deleteOffreSpecial);

module.exports = router;
