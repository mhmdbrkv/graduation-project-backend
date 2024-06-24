const express = require("express");
const upload = require("multer")();

const csrfProtection = require("../utils/csrfToken");

const {
  createUserValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  sendotp,
  createUser,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

// csrf token endpoint
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post("/sendotp", sendotp);

router.post("/create-user", upload.any(), createUserValidator, createUser);
router.post("/login", loginValidator, login);

router.post("/forgot-password", csrfProtection, forgotPassword);
router.post("/verify-reset-code", csrfProtection, verifyResetCode);
router.post("/reset-password", csrfProtection, resetPassword);

module.exports = router;
