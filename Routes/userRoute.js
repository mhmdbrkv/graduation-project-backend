const express = require("express");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deActivateUserValidator,
  changeUserPassword,
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
} = require("../services/userService");

const authServices = require("../services/authService");

const router = express.Router();

router.put(
  "/change-password/:id",
  authServices.protect,
  authServices.allowedTo("user"),
  changeUserPassword,
  changePassword
);

router.use(authServices.protect, authServices.allowedTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(userProfImg, imageProcessing, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(userProfImg, imageProcessing, updateUserValidator, updateUser)
  .put(deActivateUserValidator, deActivateUser);

module.exports = router;
