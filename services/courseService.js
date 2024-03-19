const asyncHandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");
const { uploadOneImage } = require("../Middlewares/uploadFileMiddleware");
const ApiError = require("../utils/apiError");
const handler = require("./handlersFactory");
const Course = require("../Models/courseModel");
const User = require("../Models/userModel");

// multer diskStorage
exports.courseThumbnail = uploadOneImage("thumbnail", "uploads/courses");

// set cloudinry url into req.body.image
exports.uploadToCloudinry = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      width: 600,
      height: 600,
      crop: "fill",
      folder: "courses",
    });
    req.body.thumbnail = result.secure_url;
  }
  next();
});

// @desc    Get list of courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = handler.gettAll(Course, "Course");

// @desc    Get specific course by id
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = handler.getOne(Course, "reviews sections");

// @desc    Create course
// @route   POST  /api/v1/courses
// @access  Private/Instructor
exports.createCourse = asyncHandler(async (req, res) => {
  const newCourse = await Course.create(req.body);
  await User.findOneAndUpdate(
    { _id: newCourse.instructor },
    { $addToSet: { myCourses: newCourse._id } }
  );

  res.status(201).json({ data: newCourse });
});

// @desc    Update specific course
// @route   PUT /api/v1/courses/:id
// @access  Private/Instructor
exports.updateCourse = handler.updateOne(Course);

// @desc    Delete specific course
// @route   Delete /api/v1/courses/:id
// @access  Private/Instructor
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ApiError(`No course for this id ${req.params.id}`, 404));
  }

  await User.findOneAndUpdate(
    { _id: course.instructor },
    { $pull: { myCourses: course._id } }
  );

  await Course.deleteOne({ _id: req.params.id });

  res.status(204).send();
});
