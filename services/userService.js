const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../Middlewares/uploadImagesMiddleware");
const ApiError = require("../utils/apiError");
const handler = require("./handlersFactory");
const User = require("../Models/userModel");

exports.userProfImg = uploadSingleImage("profileImage");

exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImage = filename;
  }

  next();
});

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private
exports.createUser = handler.createOne(User);

// @desc    Get specific user
// @route   GET  /api/v1/users
// @access  Private
exports.getUser = handler.getOne(User);

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private
exports.getUsers = handler.gettAll(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(201).json({ data: document });
});

// @desc    Deactive specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.deActivateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  res.status(204).json({ data: user });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 11),
      passChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(201).json({ data: document });
});
