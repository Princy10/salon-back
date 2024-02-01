const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const checkManagerRole = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
      next();
    } else {
      res.status(403);
      throw new Error('Not authorized, not a manager');
    }
};

const checkEmployeeRole = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
      next();
    } else {
      res.status(403);
      throw new Error('Not authorized, not a manager');
    }
};

module.exports = { protect , checkManagerRole, checkEmployeeRole};