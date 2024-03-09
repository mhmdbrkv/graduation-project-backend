const handler = require("./handlersFactory");
const Review = require("../Models/reviewModel");

// Nested route POST
exports.setCourseId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// Nested route GET
exports.filter = (req, res, next) => {
  let filter = {};

  if (req.params.courseId) filter = { course: req.params.courseId };

  req.filter = filter;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = handler.gettAll(Review);

// @desc    Get specific Review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = handler.getOne(Review);

// @desc    Create Review
// @route   POST  /api/v1/reviews
// @access  Private
exports.createReview = handler.createOne(Review, "Review");

// @desc    Update specific Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = handler.updateOne(Review);

// @desc    Delete specific Review
// @route   Delete /api/v1/reviews/:id
// @access  Private
exports.deleteReview = handler.deleteOne(Review, "Review");
