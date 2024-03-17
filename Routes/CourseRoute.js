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
  courseThumb,
  imageProcessing,
  addSections,
  addLectures,
  removeSection,
  removeLecture,
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
  authServices.allowedTo("instructor")
);

router.post(
  "/create-course",
  courseThumb,
  imageProcessing,
  createCousreValidator,
  createCourse
);

router
  .route("/:id")
  .put(courseThumb, imageProcessing, updateCousreValidator, updateCourse)
  .delete(deleteCousreValidator, deleteCourse);

router.post("/add-sections", addSections);
router.post("/add-lectures", addLectures);
router.delete("/remove-section", removeSection);
router.delete("/remove-lecture", removeLecture);

module.exports = router;
