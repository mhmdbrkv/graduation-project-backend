const express = require("express");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  uploadToCloudinry,
  userProfileImage,
} = require("../services/authService");

const router = express.Router();

router.post(
  "/signup",
  signupValidator,
  userProfileImage,
  uploadToCloudinry,
  signup
);
router.post("/login", loginValidator, login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.put("/reset-password", resetPassword);

module.exports = router;
