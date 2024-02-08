const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Individu = require('../models/individu');
const asyncHandler = require('express-async-handler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).populate('id_individu');

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id, user.role);
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token,
      individu: user.id_individu
    });
    console.log('login successful');
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

const register = asyncHandler(async (req, res) => {
  const { nom, prenom, cin, username, password, date_naissance, contact, adresse, mail, role } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400);
    throw new Error('Username is already taken');
  }

  const newIndividu = await Individu.create({
    date_naissance,
    contact,
    adresse,
    mail,
    nom, 
    prenom, 
    cin
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    password: hashedPassword,
    id_individu: newIndividu._id,
    role: role || 'client',
  });

  const token = generateToken(newUser._id, newUser.role);
  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    role: newUser.role,
    token,
  });
});

let invalidatedTokens = [];

const logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  invalidatedTokens.push(token);
  res.json({ message: 'Déconnexion réussie' });
  console.log("Logout successful");
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (invalidatedTokens.includes(token)) {
    res.status(401);
    throw new Error('Token invalid');
  }
  next();
};

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = { login, register, logout, verifyToken };