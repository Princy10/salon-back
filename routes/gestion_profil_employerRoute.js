const express = require('express');
const { updateUserInfo, getProfilByID } = require('../controllers/gestion_profil_employerController');
const { protect, checkEmployeeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.put('/update/:id', checkEmployeeRole, updateUserInfo);
router.get('/list/:id', checkEmployeeRole, getProfilByID);

module.exports = router;