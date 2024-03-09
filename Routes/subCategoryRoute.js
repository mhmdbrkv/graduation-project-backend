const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryId,
  filter,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const authServices = require("../services/authService");

const router = express.Router({ mergeParams: true });

router.get("/", filter, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor", "admin")
);

router
  .route("/")
  .post(setCategoryId, createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
