const Emploi = require('../models/emplois')
const User = require('../models/user');
const Individu = require('../models/individu');
const Fonction = require('../models/fonction');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const ajout_employe = asyncHandler(async (req, res) => {
    const { nom, prenom, cin, username, password, date_naissance, contact, adresse, mail, role, code_fonction, salaire, date_debut, date_fin, heure_travail } = req.body;
  
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400);
      throw new Error('Username is already taken');
    }
  
    // Créer un nouvel individu
    const newIndividu = await Individu.create({
      date_naissance,
      contact,
      adresse,
      mail,
      nom, 
      prenom, 
      cin
    });
  
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Créer un nouvel utilisateur
    const newUser = await User.create({
      username,
      password: hashedPassword,
      id_individu: newIndividu._id,
      role: role || 'employer',
    });
  
    // Créer un nouvel emploi
    const newEmploi = await Emploi.create({
      id_individu: newIndividu._id,
      code_fonction: await getCodeFonction(code_fonction),
      salaire,
      date_debut,
      date_fin,
      heure_travail,
    });
  
    // Générer un jeton JWT
    const token = generateToken(newUser._id, newUser.role);
  
    // Répondre avec les détails de l'utilisateur et le jeton
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      token,
    });
  });

  const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
  };

  const getCodeFonction = async (code_fonction) => {
    try {
      // Rechercher l'objet Fonction correspondant au code_fonction
      const fonction = await Fonction.findOne({ code_fonction });
      if (fonction) {
        // Retourner l'ID de l'objet Fonction trouvé
        return fonction.code_fonction;
      } else {
        throw new Error('Function not found');
      }
    } catch (error) {
      throw new Error('Error getting function: ' + error.message);
    }
  };

module.exports = {
    ajout_employe
}