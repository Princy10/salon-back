const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Individu = require('../models/individu');
const asyncHandler = require('express-async-handler');

const getEmployerById = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'employer' });

  if (!users || users.length === 0) {
    res.status(404);
    throw new Error('No users with role "employer" found');
  }

  const individusPromises = users.map(async (user) => {
    const individu = await Individu.findById(user.id_individu);
    return individu;
  });
  
  const individus = await Promise.all(individusPromises);

  res.json(individus);
});

module.exports = { getEmployerById };