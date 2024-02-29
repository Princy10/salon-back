const Rdv = require('../models/rdv');
const Rdv_service = require('../models/rdv_service');
const User = require("../models/user");
const Individu = require("../models/individu");
const Horaire_travail = require("../models/horaire_travail");
const PreferenceEmployer = require("../models/preference_employer");
const PreferenceService = require("../models/preference_service");
const asyncHandler = require('express-async-handler');
const nodemailer = require("nodemailer");

const insererRdvEtServices = asyncHandler(async (req, res) => {
  try {
    const { id_individu_client, id_individu_empl, date_heure, etat, services } = req.body;

    const horaireTravail = await Horaire_travail.findOne({ individu: id_individu_empl });

    if (!horaireTravail) {
      return res.status(400).json({ error: 'L\'horaire de travail de l\'employé n\'a pas été trouvé' });
    }

    const [heureDebut, minuteDebut] = horaireTravail.heure_debut.split(':').map(val => parseInt(val));
    const [heureFin, minuteFin] = horaireTravail.heure_fin.split(':').map(val => parseInt(val));
    const debutEnMinutes = heureDebut * 60 + minuteDebut;
    const finEnMinutes = heureFin * 60 + minuteFin;

    const dateRdv = new Date(date_heure);
    const heureRdv = dateRdv.getHours();
    const minuteRdv = dateRdv.getMinutes();
    const rdvEnMinutes = heureRdv * 60 + minuteRdv;

    if (rdvEnMinutes >= debutEnMinutes && rdvEnMinutes <= finEnMinutes) {
      const nouveauRdv = new Rdv({
        id_individu_client,
        id_individu_empl,
        date_heure,
        etat
      });

      const rdvEnregistre = await nouveauRdv.save();

      for (const id_service of services) {
        const nouveauRdvService = new Rdv_service({
          id_rdv: rdvEnregistre._id,
          id_service
        });
        await nouveauRdvService.save();
      }

      await mettreAJourPreferences(id_individu_client, id_individu_empl, services);

      return res.status(201).json({ message: 'Rendez-vous et services enregistrés avec succès' });
    } else {
      return res.status(400).json({ error: 'Le rendez-vous est en dehors des heures de travail de l\'employé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du rendez-vous et des services' });
  }
});


const insererpreferenceRdv = asyncHandler(async (req, res) => {
  try {
    const { id_individu_client, id_individu_empl, date_heure, etat, services } = req.body;

    const nouveauRdv = new Rdv({
      id_individu_client,
      id_individu_empl,
      date_heure,
      etat
    });

    const rdvEnregistre = await nouveauRdv.save();

    for (const id_service of services) {
      const nouveauRdvService = new Rdv_service({
        id_rdv: rdvEnregistre._id,
        id_service
      });
      await nouveauRdvService.save();
    }

    res.status(201).json({ message: 'Rendez-vous et services enregistrés avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de enregistrement du rendez-vous et des services' });
  }
});

const mettreAJourPreferences = async (id_client, id_employer, services) => {
  console.log("ID Client:", id_client);
  console.log("ID Employer:", id_employer);
  console.log("Services:", services);

  const countRdvEmploye = await Rdv.countDocuments({ id_individu_client: id_client, id_individu_empl: id_employer });
  console.log("Nombre de RDV Employé:", countRdvEmploye);

  for (const id_service of services) {
    const countRdvService = await Rdv_service.countDocuments({ id_service: id_service });
    console.log("Compte des RDV Service:", countRdvService);

    if (countRdvService > 5) {
      await PreferenceService.findOneAndUpdate({ id_client, id_service }, { $inc: { nombre_rdv: 1 } }, { upsert: true });
    }
  }

  if (countRdvEmploye > 5) {
    await PreferenceEmployer.findOneAndUpdate({ id_client, id_employer }, { $inc: { nombre_rdv: 1 } }, { upsert: true });
  }
};

//RDV  EMPLOYER
const getRdvEmplByID = asyncHandler(async(req, res) => {
  try {
      const {id} = req.params;
      const rdvs = await Rdv.find({ id_individu_empl: id }).populate('id_individu_client', 'nom prenom').populate('id_individu_empl', 'nom prenom');
      const rdvsWithServices = [];

    for (const rdv of rdvs) {
      const rdvServices = await Rdv_service.find({ id_rdv: rdv._id }).populate('id_service');
      const rdvWithServices = { ...rdv._doc, services: rdvServices.map(rdvService => rdvService.id_service) };
      rdvsWithServices.push(rdvWithServices);
    }
      res.status(200).json(rdvsWithServices);
  } catch (error) {
      res.status(500);
      throw new error(error.message);
  }
})

const getRdvEmplByIDEtat = asyncHandler(async(req, res) => {
  try {
      const {id} = req.params;
      const rdvs = await Rdv.find({ id_individu_empl: id, etat: 'fin' }).populate('id_individu_client', 'nom prenom').populate('id_individu_empl', 'nom prenom');
      const rdvsWithServices = [];

      for (const rdv of rdvs) {
          const rdvServices = await Rdv_service.find({ id_rdv: rdv._id }).populate('id_service');
          const rdvWithServices = { ...rdv._doc, services: rdvServices.map(rdvService => rdvService.id_service) };
          rdvsWithServices.push(rdvWithServices);
      }

      res.status(200).json(rdvsWithServices);
  } catch (error) {
      res.status(500);
      throw new Error(error.message);
  }
});

const getRdvByID = asyncHandler(async(req, res) => {
  try {
    const {id} = req.params;
    const rdv = await Rdv.findById(id)
      .populate('id_individu_client', 'nom prenom')
      .populate('id_individu_empl', 'nom prenom');

    if (!rdv) {
      res.status(404);
      throw new Error('Rendez-vous not found');
    }

    const rdvServices = await Rdv_service.find({ id_rdv: rdv._id }).populate('id_service');

    const response = {
      _id: rdv._id,
      id_individu_client: rdv.id_individu_client,
      id_individu_empl: rdv.id_individu_empl,
      date_heure: rdv.date_heure,
      etat: rdv.etat,
      services: rdvServices.map(rdvService => rdvService.id_service),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const etatRdvValider = asyncHandler(async(req, res) => {
  try {
      const {id} = req.params;
      const rdv = await Rdv.findByIdAndUpdate(id, { etat: "Valider" }, { new: true });

      if(!rdv){
          res.status(404);
          throw new Error(`Cannot find or update the rendez-vous with ID ${id}`);
      }

      const user = await User.findOne({ id_individu: rdv.id_individu_client });

      const individu = await Individu.findById(rdv.id_individu_client);

      if (!user || !individu) {
        res.status(404);
        throw new Error(`Cannot find user or individu associated with the rendez-vous with ID ${id}`);
    }

      const message = `Bonjour ,\nVotre rendez-vous est valider à ${rdv.date_heure}`;
      sendEmail(individu.mail, "Rendez-vous valider", message);
      res.status(200).json(rdv);
      
  } catch (error) {
      res.status(500);
      throw new Error(error.message);
  }
});

const etatRdvRefuser = asyncHandler(async(req, res) => {
  try {
      const {id} = req.params;
      const rdv = await Rdv.findByIdAndUpdate(id, { etat: "Refuser" }, { new: true });

      if(!rdv){
          res.status(404);
          throw new Error(`Cannot find or update the rendez-vous with ID ${id}`);
      }

      const user = await User.findOne({ id_individu: rdv.id_individu_client });

      const individu = await Individu.findById(rdv.id_individu_client);

      if (!user || !individu) {
        res.status(404);
        throw new Error(`Cannot find user or individu associated with the rendez-vous with ID ${id}`);
    }

      const message = `Bonjour ,\nVotre rendez-vous le ${rdv.date_heure} est réfuser parceque la journée est déja remplie`;
      sendEmail(individu.mail, "Rendez-vous réfuser", message);
      res.status(200).json(rdv);
      
  } catch (error) {
      res.status(500);
      throw new Error(error.message);
  }
});

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

//RDV Client
const getRdvClientByID = asyncHandler(async(req, res) => {
  try {
      const {id} = req.params;
      const rdvs = await Rdv.find({ id_individu_client: id }).populate('id_individu_client', 'nom prenom').populate('id_individu_empl', 'nom prenom');
      const rdvsWithServices = [];

    for (const rdv of rdvs) {
      const rdvServices = await Rdv_service.find({ id_rdv: rdv._id }).populate('id_service');
      const rdvWithServices = { ...rdv._doc, services: rdvServices.map(rdvService => rdvService.id_service) };
      rdvsWithServices.push(rdvWithServices);
    }
      res.status(200).json(rdvsWithServices);
  } catch (error) {
      res.status(500);
      throw new error(error.message);
  }
})

const etatRdvAnnuler = asyncHandler(async(req, res) => {
  try {
      const {id} = req.params;
      const rdv = await Rdv.findByIdAndUpdate(id, { etat: "Annuler" }, { new: true });

      if(!rdv){
          res.status(404);
          throw new Error(`Cannot find or update the rendez-vous with ID ${id}`);
      }

      const user = await User.findOne({ id_individu: rdv.id_individu_empl });

      const individu = await Individu.findById(rdv.id_individu_empl);

      if (!user || !individu) {
        res.status(404);
        throw new Error(`Cannot find user or individu associated with the rendez-vous with ID ${id}`);
    }

      const message = `Bonjour ,\nLe rendez-vous du ${rdv.date_heure} est annuler a cause d'une imprevue par ${individu.nom} ${individu.prenom}`;
      sendEmail(individu.mail, "Rendez-vous annuler", message);
      res.status(200).json(rdv);
      
  } catch (error) {
      res.status(500);
      throw new Error(error.message);
  }
});

const updatePreferences = asyncHandler(async (req, res) => {
  try {
    const { id_client, id_employer, id_service } = req.params;

    await PreferenceService.findOneAndUpdate(
      { id_client, id_service },
      { $set: { id_service }, $setOnInsert: { id_client }, $setDefaultsOnInsert: { nombre_rdv: 0 } },
      { upsert: true, new: true }
    );

    await PreferenceEmployer.findOneAndUpdate(
      { id_client, id_employer },
      { $set: { id_employer }, $setOnInsert: { id_client }, $setDefaultsOnInsert: { nombre_rdv: 0 } },
      { upsert: true, new: true }
    );

    await PreferenceService.updateOne({ id_client, id_service }, { $set: { nombre_rdv: 0 } });

    await PreferenceEmployer.updateOne({ id_client, id_employer }, { $set: { nombre_rdv: 0 } });

    res.status(200).json({ message: 'Préférences mises à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des préférences :", error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des préférences' });
  }
});

module.exports = {
  insererRdvEtServices,
  getRdvEmplByID,
  getRdvEmplByIDEtat,
  getRdvByID,
  etatRdvValider,
  etatRdvRefuser,
  getRdvClientByID,
  etatRdvAnnuler,
  insererpreferenceRdv,
  updatePreferences
};