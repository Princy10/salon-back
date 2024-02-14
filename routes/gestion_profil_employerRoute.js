const express = require('express');
const { updateUserInfo } = require('../controllers/gestion_profil_employerController');
const { protect, checkEmployeeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.put('/update/:id', checkEmployeeRole, updateUserInfo);

module.exports = router;