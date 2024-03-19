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

const subCategoryRoute = require("./subCategoryRoute");

const authServices = require("../services/authService");

const router = express.Router();

//Nested Route
router.use("/:categoryId/subcategories", subCategoryRoute);

router.get("/", getCategories);
router.get("/:id", getCategoryValidator, getCategory);

router.use(
  authServices.protect,
  authServices.allowedTo("instructor"),
  authServices.isActive
);

router.post(
  "/",
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
