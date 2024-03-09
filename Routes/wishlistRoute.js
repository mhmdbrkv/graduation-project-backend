const express = require("express");

const authServices = require("../services/authService");

const { wishListValidator } = require("../utils/validators/wishListValidator");

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../services/wishlistService");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").get(getWishlist).post(wishListValidator, addToWishlist);

router.delete("/:courseId", wishListValidator, removeFromWishlist);

module.exports = router;
