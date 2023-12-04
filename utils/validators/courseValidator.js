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
    .isLength({ min: 12, max: 150 })
    .withMessage("course title length must be between 12 and 150 characters"),

  check("priefDesc")
    .notEmpty()
    .withMessage("Course prief Required")
    .isLength({ min: 32, max: 500 })
    .withMessage("Course prief length must be between 50 and 500 characters"),

  check("descFileName")
    .notEmpty()
    .withMessage("description File Name Required"),

  check("duration")
    .notEmpty()
    .withMessage("duration required")
    .isNumeric()
    .withMessage("Invalid course duration format"),

  check("learningGoalsFileName")
    .notEmpty()
    .withMessage("learning Goals FileName required"),

  check("instructor")
    .notEmpty()
    .withMessage("instructor Name required")
    .not()
    .isNumeric()
    .withMessage("Invalid instructor name format"),

  check("languages")
    .notEmpty()
    .withMessage("languages required")
    .isArray()
    .withMessage("Insert languages as array"),

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
  check("content").notEmpty().withMessage("content required"),
  check("requirementsFileName")
    .notEmpty()
    .withMessage("Requirements File Name required"),
  check("sideMetaFileName")
    .notEmpty()
    .withMessage("side meta File Name required"),
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
