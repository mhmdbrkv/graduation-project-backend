const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const { uploadOneImage } = require("../Middlewares/uploadFileMiddleware");
const ApiError = require("../utils/apiError");
const handler = require("./handlersFactory");
const Course = require("../Models/courseModel");
const User = require("../Models/userModel");

// multer diskStorage
exports.courseThumbnail = uploadOneImage("thumbnail");

// set cloudinry url into req.body.image
exports.uploadToCloudinry = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinaryUploadImage(req.file.path, "courses");

    req.body.thumbnail = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    // delete file from server
    fs.unlinkSync(req.file.path);
  }
  next();
});

// Nested post route
exports.postFilter = async (req, res, next) => {
  if (req.body.subCategory) req.body.subCategories = [];
  req.body.subCategories.push(req.body.subCategory);

  next();
};

// Nested get route
exports.getFilter = async (req, res, next) => {
  let filter = {};

  // get all courses of a specific category
  if (req.params.categoryId) filter = { category: req.params.categoryId };

  // get all courses of a specific sub category
  if (req.params.subCategoryId)
    filter = { subCategories: { $in: req.params.subCategoryId } };

  req.filter = filter;
  next();
};

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
