const User = require('../models/user');
const Individu = require('../models/individu');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');

const updateUserInfo = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, ...individuData } = req.body;
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, { username, ...req.body }, { new: true });
      console.log("updatedUser:", updatedUser);
  
      await Individu.findByIdAndUpdate(updatedUser.id_individu, individuData);
  
      const io = req.app.get('io');
      io.emit('updateUserInfo');
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = {
    updateUserInfo
}