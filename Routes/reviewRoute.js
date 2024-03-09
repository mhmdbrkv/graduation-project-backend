const express = require("express");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  getReviewsValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  filter,
  setCourseId,
} = require("../services/reviewServise");

const authServices = require("../services/authService");

const router = express.Router({ mergeParams: true });

router.get("/", filter, getReviewsValidator, getReviews);
router.get("/:id", getReviewValidator, getReview);

router.use(authServices.protect, authServices.isActive);

router
  .route("/")
  .post(
    authServices.allowedTo("user"),
    setCourseId,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .put(authServices.allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    authServices.allowedTo("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
