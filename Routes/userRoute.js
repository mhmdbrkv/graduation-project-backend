const express = require("express");

const {
  changeLoggeedUserPasswordValidator,
  updateLoggeedUserDataValidator,
} = require("../utils/validators/userValidator");

const {
  getUser,
  userProfImg,
  imageProcessing,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deActivateLoggedUser,
  activateLoggedUser,
} = require("../services/userService");

const authServices = require("../services/authService");

const router = express.Router();

router.use(authServices.protect);
router.put("/activate-me", activateLoggedUser);
router.delete("/deActivate-me", deActivateLoggedUser);

router.use(authServices.isActive);

////////////////////////////// User General //////////////////////////////
router.get("/get-me", getUser);
router.put(
  "/change-my-password",
  changeLoggeedUserPasswordValidator,
  changeLoggedUserPassword
);
router.put(
  "/update-my-data",
  userProfImg,
  imageProcessing,
  updateLoggeedUserDataValidator,
  updateLoggedUserData
);

module.exports = router;
