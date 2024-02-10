const express = require('express');
const { getServices, getServiceByID, createService, updateService, deleteService } = require('../controllers/servicesController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/list', checkManagerRole, getServices);
router.get('/list/:id', checkManagerRole, getServiceByID);
router.post('/create', checkManagerRole, createService);
router.put('/update/:id', checkManagerRole, updateService);
router.delete('/delete/:id', checkManagerRole, deleteService);

module.exports = router;