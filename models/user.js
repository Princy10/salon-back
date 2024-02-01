const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Enter a username'],
    },
    password: {
      type: String,
      required: [true, 'Enter a password'],
    },
    role: {
      type: String,
      default: 'client',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;