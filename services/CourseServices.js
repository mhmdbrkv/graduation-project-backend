const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CourseModel = require("../Models/CourseModel");

// get all courses
// api/v1/courses
// public
exports.getCourses = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const courses = await CourseModel.find({}).skip(skip).limit(limit);
  res.status(201).json({ results: courses.length, page, data: courses });
});

// get specefic courses
// api/v1/courses/:id
// public
exports.getCourse = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const course = await CourseModel.findById(id);
  if (!course) {
    res.status(404).json({ msg: `no course for this id ${id}` });
  }
  res.status(201).json({ data: course });
});

// Create Course
// api/v1/courses
// private (admin only)
exports.createCourse = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const course = await CourseModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: course });
});

// Update Course
// api/v1/courses/:id
// private (admin only)
exports.updateCourse = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const course = await CourseModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!course) {
    res.status(404).json({ msg: `no course for this id ${id}` });
  }
  res.status(201).json({ data: course });
});

// delete Course
// api/v1/courses/:id
// private (admin only)
exports.deleteCourse = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const course = await CourseModel.findByIdAndDelete(id);
  if (!course) {
    res.status(404).json({ msg: `no course for this id ${id}` });
  }
  res.status(201).json({ msg: `deleted course for this id ${id}` });
});
