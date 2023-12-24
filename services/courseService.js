// const fs = require("fs");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Course = require("../Models/courseModel");
const ApiError = require("../utils/apiError");

// get all courses
// api/v1/courses
// public
exports.getCourses = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}).skip(skip).limit(limit);
  // .populate({ path: "category subCategory", select: "name -_id" });
  res.status(200).json({ results: courses.length, page, data: courses });
});

// get specefic courses
// api/v1/courses/:id
// public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  // .populate({ path: "category subCategory", select: "name -_id" });

  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(200).json({ data: course });
});

// Create Course
// api/v1/courses
// private (admin only)
exports.createCourse = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const course = await Course.create(req.body);
  res.status(201).json({ data: course });
});

// Update Course
// api/v1/courses/:id
// private (admin only)
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  req.body.slug = slugify(name);

  const course = await Course.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(201).json({ data: course });
});

// delete Course
// api/v1/courses/:id
// private (admin only)
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(204).send();
});
