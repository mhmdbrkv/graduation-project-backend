const express = require("express");

const {
  addSectionValidator,
  addlectureValidator,
  removeSectionValidator,
  removelectureValidator,
} = require("../utils/validators/sectionValidator");

const {
  addSection,
  addLecture,
  removeSection,
  removeLecture,
  lectureVideo,
  uploadToCloudinry,
} = require("../services/sectionService");

const authServices = require("../services/authService");

const router = express.Router();

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor")
);

router.post("/:courseId", addSectionValidator, addSection);
router.post(
  "/:sectionId/add-lectures",
  addlectureValidator,
  lectureVideo,
  uploadToCloudinry,
  addLecture
);
router.delete(
  "/remove-section/:sectionId",
  removeSectionValidator,
  removeSection
);
router.delete(
  "/:sectionId/remove-lecture/:lectureId",
  removelectureValidator,
  removeLecture
);

module.exports = router;
