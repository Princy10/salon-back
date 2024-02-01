const express = require('express');
const { getExamples, getExampleByID, createExample, updateExample, deleteExample } = require('../controllers/exampleController');
const { login, register, logout } = require('../controllers/authController');
const { protect, checkEmployeeRole, checkManagerRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes (require authentication)
router.use(protect);

// Route protégée pour la liste des exemples avec vérification du rôle de manager
router.get('/list', checkManagerRole, getExamples);

// Ajoutez la route de déconnexion
router.post('/logout', logout);

router.get('/list/:id', getExampleByID);
router.post('/create', createExample);
router.put('/update/:id', updateExample);
router.delete('/delete/:id', deleteExample);

module.exports = router;