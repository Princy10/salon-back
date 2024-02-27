const PreferenceEmployer = require('../models/preference_employer')
const PreferenceService = require('../models/preference_service')
const asyncHandler = require('express-async-handler')

const getPreferenceEmpl = asyncHandler(async(req, res) => {
    try {
        const prefeEmpl = await PreferenceEmployer.find({});
        res.status(200).json(prefeEmpl);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})

const getPreferenceEmployerByIdClient = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;
      const preferences = await PreferenceEmployer.find({ id_client: id }).populate('id_client').populate('id_employer');
      res.status(200).json(preferences);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const getPreferenceIdClient = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;
      const preferences = await PreferenceEmployer.find({ id_client: id }).populate('id_client').populate('id_employer');
      const preferencesService = await PreferenceService.find({ id_client: id }).populate('id_client').populate('id_service');
      res.status(200).json({ preferences, preferencesService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = {
    getPreferenceEmpl,
    getPreferenceEmployerByIdClient,
    getPreferenceIdClient
}