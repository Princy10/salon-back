const Rdv = require("../models/rdv");
const JournalCaisse = require("../models/journal_caisse");
const Rdv_service = require("../models/rdv_service");
const Services = require("../models/services");
const Individu = require("../models/individu");
const asyncHandler = require("express-async-handler");

const statReserv = asyncHandler(async (req, res) => {
  try {
    const dailyStats = await Rdv.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date_heure" },
            month: { $month: "$date_heure" },
            year: { $year: "$date_heure" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const monthlyStats = await Rdv.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$date_heure" },
            year: { $year: "$date_heure" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ dailyStats, monthlyStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const statChiffreAffaire = asyncHandler(async (req, res) => {
  try {
    const dailyStats = await JournalCaisse.aggregate([
      {
        $match: {
          type_mouvement: "Crédit",
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date_heure" },
            month: { $month: "$date_heure" },
            year: { $year: "$date_heure" },
          },
          totalAmount: { $sum: "$montant" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const monthlyStats = await JournalCaisse.aggregate([
      {
        $match: {
          type_mouvement: "Crédit",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date_heure" },
            year: { $year: "$date_heure" },
          },
          totalAmount: { $sum: "$montant" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ dailyStats, monthlyStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const statBenefice = asyncHandler(async (req, res) => {
  try {
    const monthlyCreditStats = await JournalCaisse.aggregate([
      {
        $match: {
          type_mouvement: "Crédit",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date_heure" },
            year: { $year: "$date_heure" },
          },
          totalCredit: { $sum: "$montant" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyDebitStats = await JournalCaisse.aggregate([
      {
        $match: {
          type_mouvement: "Débit",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date_heure" },
            year: { $year: "$date_heure" },
          },
          totalDebit: { $sum: "$montant" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ monthlyCreditStats, monthlyDebitStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const statTempsMoyenTravail = asyncHandler(async (req, res) => {
  try {
    const tempsMoyenTravailParEmploye = await Rdv.aggregate([
      {
        $match: {
          etat: "fin",
        },
      },
      {
        $lookup: {
          from: "individus",
          localField: "id_individu_empl",
          foreignField: "_id",
          as: "employe",
        },
      },
      {
        $unwind: "$employe",
      },
      {
        $lookup: {
          from: "rdv_services",
          localField: "_id",
          foreignField: "id_rdv",
          as: "rdv_services",
        },
      },
      {
        $unwind: "$rdv_services",
      },
      {
        $lookup: {
          from: "services",
          localField: "rdv_services.id_service",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $unwind: "$service",
      },
      {
        $group: {
          _id: {
            id_individu_empl: "$id_individu_empl",
            nom: "$employe.nom",
            prenom: "$employe.prenom",
          },
          totalTempsTravail: { $sum: "$service.durer" },
          travaux: { 
            $push: { 
              nom: "$service.titre",
              durer: "$service.durer"
            } 
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          nom: "$_id.nom",
          prenom: "$_id.prenom",
          tempsMoyen: { $divide: ["$totalTempsTravail", "$count"] },
          travaux: 1,
        },
      },
    ]);

    res.json(tempsMoyenTravailParEmploye);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  statReserv,
  statChiffreAffaire,
  statBenefice,
  statTempsMoyenTravail,
};