const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary");
const { uploadOneImage } = require("../Middlewares/uploadFileMiddleware");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/apiError");
const User = require("../Models/userModel");

// multer diskStorage
exports.userProfileImage = uploadOneImage("profileImage", "uploads/users");

// set cloudinry url into req.body.image
exports.uploadToCloudinry = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      width: 600,
      height: 600,
      crop: "fill",
      folder: "users",
    });
    req.body.profileImage = result.secure_url;
  }
  next();
});

// @desc    Get loggged user
// @route   GET /api/v1/users/get-me
// @access  Private
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "myCourses",
    select: "title subtitle price enrolled ratingsNumber avgRatings",
  });

  if (!user) {
    throw new ApiError(`No document with the id of ${req.params.id}`, 404);
  }

  const data = {};

  if (user.role === "instructor") {
    let numberOfStudents = 0;
    let numberOfReviews = 0;

    user.myCourses.forEach((course) => {
      numberOfStudents += course.enrolled;
      numberOfReviews += course.ratingsNumber;
    });

    data.numberOfStudents = numberOfStudents;
    data.numberOfReviews = numberOfReviews;
  }

  data.user = user;

  res.status(200).json(data);
});

// @desc    Change logged user password
// @route   PUT /api/v1/users/change-my-password
// @access  Private/Protect
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 11),
      passChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token: token });
});

// @desc    Update loggged user data
// @route   PUT /api/v1/users/get-me
// @access  Private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      profileImage: req.body.profileImage,
      headline: req.body.headline,
      biography: req.body.biography,
      social: req.body.social,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: user });
});

// @desc    deActivate loggged user data
// @route   PUT /api/v1/users/deActivate
// @access  Private
exports.deActivateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(204).send();
});

// @desc    activate loggged user data
// @route   PUT /api/v1/users/activate
// @access  Private
exports.activateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: true });
  res.status(200).send();
});
