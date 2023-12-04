const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CourseModel = require("../Models/courseModel");
const ApiError = require("../utils/apiError");
const fs = require("fs");

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
exports.getCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const course = await CourseModel.findById(id);
  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(201).json({ data: course });
});

// Create Course
// api/v1/courses
// private (admin only)
exports.createCourse = asyncHandler(async (req, res) => {
  let desc = fs.readFileSync(
    `assets/coursesDescription/${req.body.descFileName}.txt`,
    "utf-8"
  );
  let goals = fs.readFileSync(
    `assets/coursesLearningGoals/${req.body.learningGoalsFileName}.txt`,
    "utf-8"
  );

  let requirements = fs.readFileSync(
    `assets/coursesRequirements/${req.body.requirementsFileName}.txt`,
    "utf-8"
  );
  let sideMeta = fs.readFileSync(
    `assets/coursesSideMeta/${req.body.sideMetaFileName}.txt`,
    "utf-8"
  );

  req.body.sideMeta = sideMeta;
  req.body.requirements = requirements;
  req.body.learningGoals = goals;
  req.body.description = desc;
  req.body.slug = slugify(req.body.title);
  const course = await CourseModel.create(req.body);
  res.status(201).json({ data: course });
});

// Update Course
// api/v1/courses/:id
// private (admin only)
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const course = await CourseModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(201).json({ data: course });
});

// delete Course
// api/v1/courses/:id
// private (admin only)
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const course = await CourseModel.findByIdAndDelete(id);
  if (!course) {
    return next(new ApiError(`No course for this id ${id}`, 404));
  }
  res.status(201).json({ msg: `deleted course for this id ${id}` });
});
