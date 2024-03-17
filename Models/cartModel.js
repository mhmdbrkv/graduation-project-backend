const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        price: Number,
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalPrice: Number,
    discountedPrice: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
