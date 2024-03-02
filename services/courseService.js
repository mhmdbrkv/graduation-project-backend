const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../Middlewares/uploadImagesMiddleware");
const handler = require("./handlersFactory");
const Course = require("../Models/courseModel");

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
exports.getCourse = handler.getOne(Course);

// @desc    Create course
// @route   POST  /api/v1/courses
// @access  Private
exports.createCourse = handler.createOne(Course);

// @desc    Update specific course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = handler.updateOne(Course);

// @desc    Delete specific course
// @route   Delete /api/v1/courses/:id
// @access  Private
exports.deleteCourse = handler.deleteOne(Course);
