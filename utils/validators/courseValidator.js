const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");

exports.getCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  validatorMiddleware,
];

exports.createCousreValidator = [
  check("title")
    .notEmpty()
    .withMessage("course title required")
    .not()
    .isNumeric()
    .withMessage("Invalid course title format")
    .isLength({ min: 12, max: 60 })
    .withMessage("course title length must be between 12 and 150 words"),

  check("subtitle")
    .notEmpty()
    .withMessage("Course subtitle Required")
    .isLength({ min: 12, max: 120 })
    .withMessage("Course subtitle length must be between 50 and 500 words"),

  check("category")
    .notEmpty()
    .withMessage("Category id Required")
    .isMongoId()
    .withMessage("Invalid category id format"),

  check("subCategory")
    .notEmpty()
    .withMessage("subCategory id Required")
    .isMongoId()
    .withMessage("Invalid subCategory id format"),

  check("duration")
    .notEmpty()
    .withMessage("duration required")
    .isNumeric()
    .withMessage("Invalid course duration format"),

  check("instructor")
    .notEmpty()
    .withMessage("instructor id required")
    .isMongoId()
    .withMessage("Invalid instructor id format"),

  check("languages")
    .notEmpty()
    .withMessage("languages required")
    .isArray()
    .withMessage("Languages required as Array"),

  check("price")
    .notEmpty()
    .withMessage("price required")
    .isNumeric()
    .withMessage("invalid price format"),

  check("discountPercentage")
    .notEmpty()
    .withMessage("discountPercentage required")
    .isNumeric()
    .withMessage("invalid discount percentage format"),

  check("thmubnail").notEmpty().withMessage("thmubnail required"),

  check("content")
    .notEmpty()
    .withMessage("content required")
    .isObject()
    .withMessage("Course content required as Object"),

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
    .isObject()
    .withMessage("Course side meta data required as Object"),
  validatorMiddleware,
];

exports.updateCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  validatorMiddleware,
];

exports.deleteCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  validatorMiddleware,
];
