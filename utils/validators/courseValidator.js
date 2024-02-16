const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const Category = require("../../Models/categoryModel");
const SubCategory = require("../../Models/subCategoryModel");

exports.getCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  validatorMiddleware,
];

exports.createCousreValidator = [
  check("title")
    .notEmpty()
    .withMessage("course title required")
    .isString()
    .withMessage("Invalid course title format")
    .isLength({ min: 12, max: 60 })
    .withMessage("course title length must be between 12 and 150 words")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("subtitle")
    .notEmpty()
    .withMessage("Course subtitle Required")
    .isLength({ min: 12, max: 120 })
    .withMessage("Course subtitle length must be between 50 and 500 words"),

  check("category")
    .notEmpty()
    .withMessage("Category id Required")
    .isMongoId()
    .withMessage("Invalid category id format")

    .custom(async (value) => {
      const categoryExist = await Category.findById(value);
      if (!categoryExist)
        throw new Error(`This category id: ${value} does not exist! `);
    }),

  check("subCategories")
    .optional()
    .notEmpty()
    .withMessage("subCategory id Requivalid subCategory id format")

    .custom(async (IDs) => {
      const result = await SubCategory.find({
        _id: { $exists: true, $in: IDs },
      });
      if (result.length < 1 || result.length !== IDs.length) {
        throw new Error("Some of the provided sub categories ids are invalid");
      }
    })

    .custom(async (value, { req }) => {
      const result = await SubCategory.find({
        category: req.body.category,
      });

      const subCategoriesDB = [];

      result.forEach((ele) => {
        subCategoriesDB.push(ele._id.toString());
      });

      value.forEach((e) => {
        if (!subCategoriesDB.includes(e)) {
          throw new Error(
            `The selected sub-category with id: ${e} do not belong to this main category!`
          );
        }
      });
    }),

  check("duration")
    .notEmpty()
    .withMessage("duration required")
    .isNumeric()
    .withMessage("Invalid course duration format"),

  // check("instructor")
  //   .notEmpty()
  //   .withMessage("instructor id required")
  //   .isMongoId()
  //   .withMessage("Invalid instructor id format"),

  check("languages")
    .notEmpty()
    .withMessage("languages required")
    .isArray()
    .withMessage("Languages required as Array"),

  check("price")
    .notEmpty()
    .withMessage("price required")
    .isNumeric()
    .withMessage("invalid price format")
    .toFloat()
    .custom((val, { req }) => {
      req.body.price -= req.body.price * (req.body.discountPercentage / 100);
      return true;
    }),

  check("discountPercentage")
    .optional()
    .notEmpty()
    .withMessage("discountPercentage required")
    .isNumeric()
    .withMessage("invalid discount percentage format")
    .toFloat()
    .custom((value) => {
      if (value < 0 || value > 100)
        throw new Error("discountPercentage must be between 0 and 100");
      return true;
    }),

  check("thmubnail").notEmpty().withMessage("thmubnail required"),

  check("content")
    .notEmpty()
    .withMessage("content required")
    .isArray()
    .withMessage("Course content required as array of objects")

    .custom((value, { req }) => {
      if (typeof value[0].name !== "string" || value[0].name.length === 0) {
        throw new Error(
          "Each lesson should have a name property that is not empty."
        );
      }

      if (typeof value[0].link !== "string" || value[0].link.length === 0) {
        throw new Error(
          "Each lesson should have a link property that is not empty."
        );
      }

      return true;
    }),

  check("learningGoals")
    .notEmpty()
    .withMessage("learning goals required")
    .isArray()
    .withMessage("Course learning goals required as Array"),

  check("requirements")
    .notEmpty()
    .withMessage("requirements required")
    .isArray()
    .withMessage("Course requirements required as Array"),

  check("audience")
    .notEmpty()
    .withMessage("audience required")
    .isArray()
    .withMessage("Course audience required as Array"),

  check("description")
    .notEmpty()
    .withMessage("description required")
    .isLength({ min: 200 })
    .withMessage("Course description length must be 200 words minimum"),

  check("sideMeta")
    .notEmpty()
    .withMessage("side meta data required")
    .isArray()
    .withMessage("Course side meta data required as array"),
  validatorMiddleware,
];

exports.updateCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  check("title")
    .not()
    .isNumeric()
    .withMessage("invalid title format")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  validatorMiddleware,
];
