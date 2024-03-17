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

// @desc    Get instructor courses
// @route   GET /api/v1/users/instructor/my-courses
// @access  Protected/instructor
exports.getMyCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.findOne({ instructor: req.user._id });
  res.status(200).json({
    results: courses.length,
    data: courses,
  });
});

// @desc    Get list of courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = handler.gettAll(Course, "Course");

// @desc    Get specific course by id
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = handler.getOne(Course, "reviews");

// @desc    Create course
// @route   POST  /api/v1/courses
// @access  Private
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
// @access  Private
exports.updateCourse = handler.updateOne(Course);

// @desc    Delete specific course
// @route   Delete /api/v1/courses/:id
// @access  Private
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

//////////////////////////// Sections ////////////////////////////

// @desc Add sections into course by courseId
// @route   POST /api/v1/courses/:courseId/add-sections
// @access  Private
exports.addSections = asyncHandler(async (req, res, next) => {
  const course = await Course.findOneAndUpdate(
    {
      _id: req.body.courseId,
      instructor: req.user._id,
    },
    {
      $addToSet: { sections: req.body.sections },
    },
    { new: true }
  );
  if (!course) {
    throw new Error(
      "No course found for this id or you are not the instructor of this course"
    );
  }

  res.status(200).json({
    success: true,
    message: "Sections added successfully",
    numOfSections: course.sections.length,
    data: course.sections,
  });
});

// @desc Add lecture into section by sectionId
// @route   POST /api/v1/courses/:courseId/:sectionId/add-lectures
// @access  Private
exports.addLectures = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({
    _id: req.body.courseId,
    instructor: req.user._id,
  });
  if (!course) {
    throw new Error(
      "No course found for this id or you are not the instructor of this course"
    );
  }

  const sectionInd = course.sections.findIndex(
    (section) => section._id.toString() === req.body.sectionId.toString()
  );

  if (sectionInd < 0) {
    throw new Error(
      `This section does not belong to this course or it has been deleted`
    );
  }
  course.sections[sectionInd].lectures.push(...req.body.lectures);
  await course.save();

  res.status(200).json({
    success: true,
    message: "Lectures added successfully",
    numOfSections: course.sections.length,
    data: course.sections,
  });
});

// @desc Remove sections from course by courseId and sectionId
// @route   Delete /api/v1/courses/:courseId/remove-section/:sectionId
// @access  Private
exports.removeSection = asyncHandler(async (req, res, next) => {
  const course = await Course.findOneAndUpdate(
    {
      _id: req.body.courseId,
      instructor: req.user._id,
    },
    {
      $pull: { sections: { _id: req.body.sectionId } },
    },
    { new: true }
  );
  if (!course) {
    throw new Error(
      "No course found for this id or you are not the instructor of this course"
    );
  }

  res.status(200).json({
    success: true,
    message: `Section removed successfully`,
    numOfSections: course.sections.length,
    data: course.sections,
  });
});

// @desc Remove lecture from section by sectionId
// @route   Delete /api/v1/courses/:courseId/:sectionId/remove-lecture/:lectureId
// @access  Private
exports.removeLecture = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({
    _id: req.body.courseId,
    instructor: req.user._id,
  });
  if (!course) {
    throw new Error(
      "No course found or you are not the instructor of this course"
    );
  }

  const sectionInd = course.sections.findIndex(
    (section) => section._id.toString() === req.body.sectionId.toString()
  );

  if (sectionInd < 0) {
    throw new Error(
      `This section does not belong to this course or it has been deleted`
    );
  }

  const tempArr = course.sections[sectionInd].lectures.filter(
    (lecture) => lecture._id.toString() !== req.body.lectureId.toString()
  );

  course.sections[sectionInd].lectures = tempArr;
  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture removed successfully",
    numOfSections: course.sections.length,
    data: course.sections,
  });
});
