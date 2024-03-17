const express = require("express");

const authServices = require("../services/authService");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("instructor"));

const { getMyCourses } = require("../services/courseService");

router.get("/my-courses", getMyCourses);
module.exports = router;
