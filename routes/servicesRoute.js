const express = require('express');
const { getServices, getServiceByID, createService, updateService, deleteService } = require('../controllers/servicesController');
const { protect, checkEmployeeRole, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

router.get('/list_service', checkManagerRole, getServices);

router.get('/list_service/:id', getServiceByID);
router.post('/create_service', createService);
router.put('/update_service/:id', updateService);
router.delete('/delete_service/:id', deleteService);

module.exports = router;