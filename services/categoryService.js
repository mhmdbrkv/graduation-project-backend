const asyncHandler = require("express-async-handler");
// const sharp = require("sharp");
// const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../utils/cloudinary");
const { uploadOneImage } = require("../Middlewares/uploadFileMiddleware");
const handler = require("./handlersFactory");
const Category = require("../Models/categoryModel");

// multer diskStorage
exports.categoryImage = uploadOneImage("image", "uploads/categories");

// set cloudinry url into req.body.image
exports.uploadToCloudinry = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      width: 600,
      height: 600,
      crop: "fill",
      folder: "categories",
    });
    req.body.image = result.secure_url;
  }
  next();
});

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = handler.gettAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = handler.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = handler.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = handler.updateOne(Category);

// @desc    Delete specific category
// @route   Delete /api/v1/categories/:id
// @access  Private
exports.deleteCategory = handler.deleteOne(Category);
