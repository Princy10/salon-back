const express = require('express');
const { getEmployer } = require('../controllers/userController');

const router = express.Router();

router.get('/list/employer', getEmployer);

module.exports = router;