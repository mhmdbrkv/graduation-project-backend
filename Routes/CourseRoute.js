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

const reviewRoute = require("./reviewRoute");
const authServices = require("../services/authService");

const router = express.Router();

//Nested Route
router.use("/:courseId/reviews", reviewRoute);

router.get("/", getCourses);
router.get("/:id", getCousreValidator, getCourse);

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor", "admin")
);

router
  .route("/")
  .post(courseThumb, imageProcessing, createCousreValidator, createCourse);

router
  .route("/:id")
  .put(courseThumb, imageProcessing, updateCousreValidator, updateCourse)
  .delete(deleteCousreValidator, deleteCourse);

module.exports = router;
