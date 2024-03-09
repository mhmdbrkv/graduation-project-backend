const express = require("express");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deActivateUserValidator,
  changeUserPasswordValidator,
  changeLoggeedUserPasswordValidator,
  updateLoggeedUserDataValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  createUser,
  getUser,
  deActivateUser,
  updateUser,
  userProfImg,
  imageProcessing,
  changePassword,
  getLoggedUser,
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

// Logged User
router.use(authServices.isActive);

router.get("/get-me", getLoggedUser, getUser);
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

// admin
router.use(authServices.allowedTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(userProfImg, imageProcessing, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(userProfImg, imageProcessing, updateUserValidator, updateUser)
  .put(deActivateUserValidator, deActivateUser);

router.put("/change-password/:id", changeUserPasswordValidator, changePassword);

module.exports = router;
