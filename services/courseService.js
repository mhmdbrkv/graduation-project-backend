const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../Middlewares/uploadImagesMiddleware");
const ApiError = require("../utils/apiError");
const handler = require("./handlersFactory");
const Course = require("../Models/courseModel");
const User = require("../Models/userModel");

exports.courseThumb = uploadSingleImage("thmubnail");

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `course-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/courses/${filename}`);
    req.body.thmubnail = filename;
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
