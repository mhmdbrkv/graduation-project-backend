const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const Course = require("../Models/courseModel");

// @desc    Get logged iser wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/student
exports.getMyLearning = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("myLearning");

  res.status(200).json({
    results: user.myLearning.length,
    data: user.myLearning,
  });
});

// @desc    Add course to learning list
// @route   POST /api/v1/learning/:courseId
// @access  Protected/student
exports.addMyLearning = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $addToSet: { myLearning: req.params.courseId },
    },
    { new: true }
  );

  await Course.findOneAndUpdate(
    { _id: req.params.courseId },
    {
      $inc: { enrolled: 1 },
    }
  );

  res.status(200).json({
    message: "Course added successfully to your learning list",
    results: user.myLearning.length,
    data: user.myLearning,
  });
});

// @desc    Remove course from learning list
// @route   DELETE /api/v1/learning/:courseId
// @access  Protected/student
exports.removeFromMyLearning = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { myLearning: req.params.courseId },
  });

  await Course.findOneAndUpdate(
    { _id: req.params.courseId },
    {
      $inc: { enrolled: -1 },
    },
    { new: true }
  );

  res.status(200).json({
    message: "Course removed successfully from your learning list",
  });
});
