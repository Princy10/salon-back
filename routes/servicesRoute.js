const express = require('express');
const { getServices, getServiceByID, createService, updateService, deleteService } = require('../controllers/servicesController');
const { protect, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/list_service', checkManagerRole, getServices);
router.get('/list_service/:id', checkManagerRole, getServiceByID);
router.post('/create_service', checkManagerRole, createService);
router.put('/update_service/:id', checkManagerRole, updateService);
router.delete('/delete_service/:id', checkManagerRole, deleteService);

module.exports = router;