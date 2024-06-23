const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  addSectionValidator,
  addlectureValidator,
  removelectureValidator,
} = require("../utils/validators/sectionValidator");

const {
  getSections,
  getLectures,
  addSection,
  addLecture,
  removeLecture,
} = require("../services/sectionService");

const authServices = require("../services/authService");
const { uploadOnCloudinary } = require("../Middlewares/cloudinaryMiddleware");
const { uploadVideo } = require("../utils/multer");

const router = express.Router();

router.get("/:courseId", getSections);
router.get("/:sectionId/lectures", getLectures);

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor")
);

router.post(
  "/:sectionId/add-lecture",
  csrfProtection,
  uploadVideo.single("lecture"),
  addlectureValidator,
  uploadOnCloudinary("lectures"),
  addLecture
);

router.delete(
  "/:sectionId/remove-lecture/:lectureId",
  removelectureValidator,
  removeLecture
);

router.post("/:courseId", csrfProtection, addSectionValidator, addSection);

module.exports = router;
