const express = require('express');
const { login, register, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

router.use(protect);

router.post('/logout', logout);

module.exports = router;