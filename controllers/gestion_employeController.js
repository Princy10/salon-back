const Emploi = require("../models/emplois");
const User = require("../models/user");
const Individu = require("../models/individu");
const Fonction = require("../models/fonction");
const Horaire_travail = require("../models/horaire_travail");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Portefeuille = require('../models/portefeuille')

const ajout_employe = asyncHandler(async (req, res) => {
  const {
    nom,
    prenom,
    cin,
    username,
    password,
    date_naissance,
    contact,
    adresse,
    mail,
    role,
    code_fonction,
    salaire,
    date_debut,
    date_fin,
    heure_travail,
  } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400);
    throw new Error("Username is already taken");
  }

  const newIndividu = await Individu.create({
    date_naissance,
    contact,
    adresse,
    mail,
    nom,
    prenom,
    cin,
  });

  const newPortefeuille = await Portefeuille.create({
    id_individu: newIndividu._id,
    solde: 0,
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    password: hashedPassword,
    id_individu: newIndividu._id,
    role: role || "employer",
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
  sendEmail(mail, "Bienvenue !", message);

  const io = req.app.get("io");
  io.emit("ajout_employe");
  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    role: newUser.role,
    token,
  });
});

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const getCodeFonction = async (code_fonction) => {
  try {
    const fonction = await Fonction.findOne({ code_fonction });
    if (fonction) {
      return fonction.code_fonction;
    } else {
      throw new Error("Function not found");
    }
  } catch (error) {
    throw new Error("Error getting function: " + error.message);
  }
};

const sendEmail = (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nampiana.fanamperana@gmail.com",
      pass: "vagp hfud nbfg buwu",
    },
  });

  const mailOptions = {
    from: "nampiana.fanamperana@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const getEmployer = async (req, res) => {
  try {
    const emplois = await Emploi.find({})
      .populate("id_individu", "nom prenom")
      .exec();
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
      res.status(404).json({ message: "Emploi not found" });
      return;
    }

    const id_individu = emploi.id_individu;

    await User.findOneAndDelete({ id_individu });

    await Individu.findByIdAndDelete(id_individu);

    await Emploi.deleteOne({ _id: id });

    const io = req.app.get("io");
    io.emit("deleteEmployer");
    res.status(200).json({ message: "Employé supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getEmployerByID = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const emploi = await Emploi.findById(id);
    res.status(200).json(emploi);
  } catch (error) {
    res.status(500);
    throw new error(error.message);
  }
});

const updateEmployer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const employer = await Emploi.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!employer) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }
    const updateEmployer = await Emploi.findById(id);
    const io = req.app.get("io");
    io.emit("updateEmployer");
    res.status(200).json(updateEmployer);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getHTravailEmpl =  asyncHandler(async (req, res) => {
  try {
    const employeId = req.params.id;
    const horaireTravail = await Horaire_travail.findOne({ individu: employeId });

    if (!horaireTravail) {
      return res.status(200).json({ message: 'Aucun horaire de travail trouvé pour cet employé', horaireTravail: null });
    }

    res.status(200).json({ message: 'Horaire de travail récupéré avec succès', horaireTravail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'horaire de travail de l\'employé' });
  }
});

const insererHoraireTravailEmpl = asyncHandler(async (req, res) => {
  try {
    const { individu, heure_debut, heure_fin } = req.body;

    const nouvelHoraireTravail = new Horaire_travail({
      individu,
      heure_debut,
      heure_fin
    });

    const horaireTravailEnregistre = await nouvelHoraireTravail.save();

    res.status(201).json({ message: 'Horaire de travail enregistré avec succès', horaireTravail: horaireTravailEnregistre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'horaire de travail' });
  }
});

const updateHoraireTravailEmpl = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { heure_debut, heure_fin } = req.body;

    let horaireTravail = await Horaire_travail.findOne({ individu: id });

    if (!horaireTravail) {
      return res.status(404).json({ error: 'Aucun horaire de travail trouvé pour cet employé' });
    }

    horaireTravail.heure_debut = heure_debut;
    horaireTravail.heure_fin = heure_fin;

    const horaireTravailMaj = await horaireTravail.save();

    res.status(200).json({ message: 'Horaire de travail mis à jour avec succès', horaireTravail: horaireTravailMaj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'horaire de travail de l\'employé' });
  }
});


module.exports = {
  ajout_employe,
  getEmployer,
  deleteEmployer,
  getEmployerByID,
  updateEmployer,
  insererHoraireTravailEmpl,
  getHTravailEmpl,
  updateHoraireTravailEmpl,
};
