const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const Course = require("../Models/courseModel");

// @desc    Add course to wishlist
// @route   POST /api/v1/wishlist/:courseId
// @access  Protected/user
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.params.courseId, interests: course.title },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Course added successfully to your wishlist",
    data: user.wishList,
  });
});

// @desc    Get logged iser wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/user
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");

  res.status(200).json({
    success: true,
    results: user.wishList.length,
    data: user.wishList,
  });
});

// @desc    Remove course from wishlist
// @route   DELETE /api/v1/wishlist/:courseId
// @access  Protected/user
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.courseId },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Course removed successfully from your wishlist",
  });
});
