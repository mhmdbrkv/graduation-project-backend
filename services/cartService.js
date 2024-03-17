const asyncHandler = require("express-async-handler");
const Course = require("../Models/courseModel");
const Coupon = require("../Models/couponModel");
const Cart = require("../Models/cartModel");

const calcCartTotalPrice = (cart) => {
  let totalItemsPrice = 0;
  cart.cartItems.forEach((item) => {
    totalItemsPrice += item.price;
  });
  cart.discountedPrice = undefined;
  cart.totalPrice = totalItemsPrice;
};

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  let cart = await Cart.findOne({ user: req.user._id });

  if (!course) throw new Error(`Course with id ${courseId} not found`);

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ course: courseId, price: course.price }],
    });
  } else {
    // course not exist in cart, push course to cartItems array
    const courseIndex = cart.cartItems.findIndex(
      (item) => item.course.toString() === courseId
    );

    if (courseIndex < 0) {
      cart.cartItems.push({ course: courseId, price: course.price });
    }
  }

  // update cart total price
  calcCartTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Course added successfully to your cart",
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new Error(`Cart is empty`);

  cart.discountedPrice = undefined;
  await cart.save();

  res
    .status(200)
    .json({ success: true, items: cart.cartItems.length, data: cart });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { course: req.params.courseId } },
    },
    { new: true }
  );

  calcCartTotalPrice(cart);
  await cart.save();

  res
    .status(200)
    .json({ success: true, items: cart.cartItems.length, data: cart });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new Error(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const { totalPrice } = cart;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.discountedPrice = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    CartItems: cart.cartItems.length,
    data: cart,
  });
});
