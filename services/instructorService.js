const asyncHandler = require("express-async-handler");
const Course = require("../Models/courseModel");

// @desc    Get instructor courses
// @route   GET /api/v1/instructor/my-courses
// @access  Protected/instructor
exports.getMyCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ instructor: req.user._id }).populate(
    "sections reviews"
  );
  res.status(200).json({
    results: courses.length,
    data: courses,
  });
});
