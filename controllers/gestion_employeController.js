const Emploi = require('../models/emplois')
const User = require('../models/user');
const Individu = require('../models/individu');
const Fonction = require('../models/fonction');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const ajout_employe = asyncHandler(async (req, res) => {
    const { nom, prenom, cin, username, password, date_naissance, contact, adresse, mail, role, code_fonction, salaire, date_debut, date_fin, heure_travail } = req.body;
  
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
      role: role || 'employer',
    });
  
    const newEmploi = await Emploi.create({
      id_individu: newIndividu._id,
      code_fonction: await getCodeFonction(code_fonction),
      salaire,
      date_debut,
      date_fin,
      heure_travail,
    });
  
    const token = generateToken(newUser._id, newUser.role);

    const message = `Bonjour ,\nVotre compte a été créé avec succès. Username:${newUser.username}\nPassword:${newUser.username}`;
    sendEmail(mail, 'Bienvenue !', message);
  
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
      const fonction = await Fonction.findOne({ code_fonction });
      if (fonction) {
        return fonction.code_fonction;
      } else {
        throw new Error('Function not found');
      }
    } catch (error) {
      throw new Error('Error getting function: ' + error.message);
    }
  };

  const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nampiana.fanamperana@gmail.com',
            pass: 'vagp hfud nbfg buwu'
        }
    });

    const mailOptions = {
        from: 'nampiana.fanamperana@gmail.com',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


  const getEmployer = async (req, res) => {
    try {
        const emplois = await Emploi.find({}).populate('id_individu', 'nom prenom').exec();
        res.status(200).json(emplois);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEmployer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
      const emploi = await Emploi.findById(id);
      if (!emploi) {
          res.status(404).json({ message: 'Emploi not found' });
          return;
      }

      const id_individu = emploi.id_individu;

      await User.findOneAndDelete({ id_individu });

      await Individu.findByIdAndDelete(id_individu);

      await Emploi.deleteOne({ _id: id });

      res.status(200).json({ message: 'Employé supprimé avec succès' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


const getEmployerByID = asyncHandler(async(req, res) => {
  try {
      const {id} = req.params;
      const emploi = await Emploi.findById(id);
      res.status(200).json(emploi);
  } catch (error) {
      res.status(500);
      throw new error(error.message);
  }
})

const updateEmployer = asyncHandler(async(req, res) => {
  try {
      const {id} = req.params;
      const employer = await Emploi.findByIdAndUpdate(id, req.body);
      // we cannot find any product in database
      if(!employer){
          res.status(404);
          throw new Error(`cannot find any product with ID ${id}`);
      }
      const updateEmployer = await Emploi.findById(id);
      res.status(200).json(updateEmployer);
      
  } catch (error) {
      res.status(500);
      throw new Error(error.message);
  }
})

module.exports = {
    ajout_employe,
    getEmployer,
    deleteEmployer,
    getEmployerByID,
    updateEmployer
}