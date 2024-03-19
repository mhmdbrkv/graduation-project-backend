const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryImage,
  uploadToCloudinry,
} = require("../services/categoryService");

const authServices = require("../services/authService");

const router = express.Router();

const subCategoryRoute = require("./subCategoryRoute");

//Nested Route
router.use("/:categoryId/subcategories", subCategoryRoute);

router.get("/", getCategories);
router.get("/:id", getCategoryValidator, getCategory);

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor")
);

router
  .route("/")
  .post(
    createCategoryValidator,
    categoryImage,
    uploadToCloudinry,
    createCategory
  );

router
  .route("/:id")
  .put(
    updateCategoryValidator,
    categoryImage,
    uploadToCloudinry,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
