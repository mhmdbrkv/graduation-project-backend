const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { cloudinaryUploadVideo } = require("../utils/cloudinary");
const { uploadOneVideo } = require("../Middlewares/uploadFileMiddleware");
const Section = require("../Models/sectionModel");

// multer diskStorage
exports.lectureVideo = uploadOneVideo("lecture");

// set cloudinry url into req.body
exports.uploadToCloudinry = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinaryUploadVideo(req.file.path, "videos");
    req.body.url = result.secure_url;
    req.body.public_id = result.public_id;
    // delete file from server
    fs.unlinkSync(req.file.path);
  }

  next();
});

// @desc Add sections into course by courseId
// @route   POST /api/v1/sections/:courseId
// @access  Private/Instructor
exports.addSection = asyncHandler(async (req, res, next) => {
  const section = await Section.create({
    course: req.params.courseId,
    sectionName: req.body.sectionName,
  });

  res.status(200).json({
    success: true,
    message: "Sections added successfully",
    numOfSections: section.length,
    data: section,
  });
});

// @desc Add lecture into section by sectionId
// @route   POST /api/v1/sections/:sectionId/add-lectures
// @access  Private/Instructor
exports.addLecture = asyncHandler(async (req, res, next) => {
  const section = await Section.findOneAndUpdate(
    { _id: req.params.sectionId },
    {
      $addToSet: {
        lectures: {
          name: req.body.name,
          url: req.body.url,
          public_id: req.body.public_id,
        },
      },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Lectures added successfully",
    numOfSections: section.length,
    data: section,
  });
});

// @desc Remove sections from course by courseId and sectionId
// @route   Delete /api/v1/sections/remove-section/:sectionId
// @access  Private/Instructor
exports.removeSection = asyncHandler(async (req, res, next) => {
  await Section.findOneAndDelete({ _id: req.params.sectionId });

  res.status(200).json({
    success: true,
    message: "Sections removed successfully",
  });
});

// @desc Remove lecture from section by sectionId
// @route   Delete /api/v1/sections/:sectionId/remove-lecture/:lectureId
// @access  Private
exports.removeLecture = asyncHandler(async (req, res, next) => {
  const section = await Section.findOneAndUpdate(
    { _id: req.params.sectionId },
    {
      $pull: { lectures: { _id: req.params.lectureId } },
    },
    { new: true }
  );
  if (!section) {
    throw new Error(
      "No section found for this id or you are not the instructor of this course"
    );
  }

  res.status(200).json({
    success: true,
    message: "Lecture removed successfully",
    numOfSections: section.length,
    data: section,
  });
});
