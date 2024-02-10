const express = require('express');
const { getFonction,  createFonction } = require('../controllers/fonctionController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/list', checkManagerRole, getFonction);
router.post('/create', checkManagerRole, createFonction);


module.exports = router;