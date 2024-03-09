const jwt = require("jsonwebtoken");

const token = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = token;
