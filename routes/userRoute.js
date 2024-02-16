const express = require('express');
const { getEmployer, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/list/employer', getEmployer);
router.put('/update', updateUser);

module.exports = router;