const express = require("express");

const {
  getCourses,
  createCourse,
  getCourse,
  deleteCourse,
  updateCourse,
} = require("../services/courseServices");

const router = express.Router();

router.route("/").post(createCourse).get(getCourses);
router.route("/:id").get(getCourse).delete(deleteCourse).put(updateCourse);

module.exports = router;
