const express = require('express');
const { getEmployerById } = require('../controllers/userController');

const router = express.Router();

router.get('/list/employer', getEmployerById);

module.exports = router;