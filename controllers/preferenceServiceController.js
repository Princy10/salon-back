const PreferenceService = require('../models/preference_service')
const asyncHandler = require('express-async-handler')

const getPreferenceservice = asyncHandler(async(req, res) => {
    try {
        const prefeService = await PreferenceService.find({});
        res.status(200).json(prefeService);
    } catch (error) {
        res.status(500);
        throw new error(error.message);
    }
})

const getPreferenceServiceByIdClient = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;
      const preferences = await PreferenceService.find({ id_client: id }).populate('id_client').populate('id_service');
      res.status(200).json(preferences);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = {
    getPreferenceservice,
    getPreferenceServiceByIdClient
}