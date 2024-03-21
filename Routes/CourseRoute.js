const express = require("express");

const {
  createCousreValidator,
  getCousreValidator,
  updateCousreValidator,
  deleteCousreValidator,
} = require("../utils/validators/courseValidator");

const {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  courseThumbnail,
  uploadToCloudinry,
  getFilter,
  postFilter,
} = require("../services/courseService");

const reviewRoute = require("./reviewRoute");
const authServices = require("../services/authService");

const router = express.Router({ mergeParams: true });

//Nested Route
router.use("/:courseId/reviews", reviewRoute);

router.get("/", getFilter, getCourses);
router.get("/:id", getCousreValidator, getCourse);

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor")
);

router.post(
  "/create-course",
  postFilter,
  createCousreValidator,
  courseThumbnail,
  uploadToCloudinry,
  createCourse
);

router
  .route("/:id")
  .put(
    postFilter,
    updateCousreValidator,
    courseThumbnail,
    uploadToCloudinry,
    updateCourse
  )
  .delete(deleteCousreValidator, deleteCourse);

module.exports = router;
