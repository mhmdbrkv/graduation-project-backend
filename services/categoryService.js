const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const { uploadOneImage } = require("../Middlewares/uploadFileMiddleware");
const handler = require("./handlersFactory");
const Category = require("../Models/categoryModel");

// multer diskStorage
exports.categoryImage = uploadOneImage("image");

// set cloudinry url into req.body
exports.uploadToCloudinry = asyncHandler(async (req, res, next) => {
  if (req.file) {
    // 1) upload to cloudinry
    const result = await cloudinaryUploadImage(req.file.path, "categories");

    // 2) set cloudinry url and public id into req body
    req.body.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    // 3) delete file from server
    fs.unlinkSync(req.file.path);
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
