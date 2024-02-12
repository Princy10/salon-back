const express = require('express');
const { ajout_employe, getEmployer, deleteEmployer, getEmployerByID, updateEmployer } = require('../controllers/gestion_employeController');
const { protect, checkManagerRole, checkEmployeeRole, checkManagerOrEmployeeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/ajout_empl', checkManagerRole, ajout_employe);
router.get('/list', checkManagerOrEmployeeRole, getEmployer);
router.get('/list/:id', checkManagerOrEmployeeRole, getEmployerByID);
router.delete('/delete/:id', checkManagerRole, deleteEmployer);
router.put('/update/:id', checkManagerOrEmployeeRole, updateEmployer);

module.exports = router;