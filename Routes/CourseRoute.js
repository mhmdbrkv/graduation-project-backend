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

const authServices = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    courseThumb,
    imageProcessing,
    createCousreValidator,
    createCourse
  )
  .get(getCourses);
router
  .route("/:id")
  .get(getCousreValidator, getCourse)
  .put(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    courseThumb,
    imageProcessing,
    updateCousreValidator,
    updateCourse
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    deleteCousreValidator,
    deleteCourse
  );

module.exports = router;
