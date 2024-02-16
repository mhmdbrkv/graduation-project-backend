const express = require("express");

const {
  getCousreValidator,
  createCousreValidator,
  updateCousreValidator,
  deleteCousreValidator,
} = require("../utils/validators/courseValidator");

const {
  getCourses,
  createCourse,
  getCourse,
  deleteCourse,
  updateCourse,
  courseThumb,
  imageProcessing,
} = require("../services/courseService");

const router = express.Router();

router
  .route("/")
  .post(courseThumb, imageProcessing, createCousreValidator, createCourse)
  .get(getCourses);
router
  .route("/:id")
  .get(getCousreValidator, getCourse)
  .put(courseThumb, imageProcessing, updateCousreValidator, updateCourse)
  .delete(deleteCousreValidator, deleteCourse);

module.exports = router;
