const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Individu = require("../models/individu");
const asyncHandler = require("express-async-handler");

const getEmployer = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "employer" });

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

const updateUser = asyncHandler(async (req, res) => {
  try {
    const {
      id,
      username,
      currentPassword,
      newPassword,
      nom,
      prenom,
      mail,
      date_naissance,
      cin,
      adresse,
      contact
    } = req.body;

    const user = await User.findById(id).populate('id_individu');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (currentPassword) {
      const isPasswordMatch = await user.matchPassword(currentPassword);
      if (!isPasswordMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    user.username = username;
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (!user.id_individu) {
      user.id_individu = new Individu({});
    }

    user.id_individu.nom = nom;
    user.id_individu.prenom = prenom;
    user.id_individu.mail = mail;
    user.id_individu.date_naissance = date_naissance;
    user.id_individu.cin = cin;
    user.id_individu.adresse = adresse;
    user.id_individu.contact = contact;

    await user.id_individu.save();
    await user.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { getEmployer, updateUser };