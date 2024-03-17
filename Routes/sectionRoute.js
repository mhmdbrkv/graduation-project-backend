const express = require("express");

const {
  addSectionValidator,
  addlectureValidator,
  removeSectionValidator,
  removelectureValidator,
} = require("../utils/validators/sectionValidator");

const {
  addSections,
  addLectures,
  removeSection,
  removeLecture,
} = require("../services/sectionService");

const authServices = require("../services/authService");

const router = express.Router();

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor")
);

router.post("/:courseId", addSectionValidator, addSections);
router.post("/:sectionId/add-lectures", addlectureValidator, addLectures);
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
