const Rdv = require("../models/rdv");
const JournalCaisse = require("../models/journal_caisse");
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

module.exports = {
  statReserv,
  statChiffreAffaire,
  statBenefice,
};
