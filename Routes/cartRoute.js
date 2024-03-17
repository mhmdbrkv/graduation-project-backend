const express = require("express");

const {
  addToCart,
  getLoggedUserCart,
  removeCartItem,
  applyCoupon,
} = require("../services/cartService");

const authServices = require("../services/authService");

const router = express.Router();

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("student")
);

router.route("/").post(addToCart).get(getLoggedUserCart);
router.route("/:courseId").delete(removeCartItem);

router.put("/apply-coupon", applyCoupon);
module.exports = router;
