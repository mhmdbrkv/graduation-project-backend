const mongoose = require("mongoose");

//create schema

const cousreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Course title Must Be Required"],
      unique: [true, "Course title Must Be unique"],
      minLength: [12, "Too Short"],
      maxlength: [60, "Too Long"],
    },

    subtitle: {
      type: String,
      require: [true, "Course subtitle Must Be Required"],
      minLength: [12, "Too Short"],
      maxlength: [120, "Too Long"],
    },

    description: {
      type: String,
      require: [true, "course description required"],
      minLength: [200, "too short cousre description length"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    duration: {
      type: Number,
      require: [true, "Course total hours Must Be Required"],
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      require: [true, "Category id required"],
    },

    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "subCategory",
      require: [true, "subCategory id required"],
    },

    learningGoals: {
      type: Array,
      require: [true, "learning Goals required"],
    },

    enrolledNum: {
      type: Number,
    },

    ratingNum: {
      type: Number,
    },

    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "Instructor",
      require: [true, "Course instructor ID Must Be Required"],
    },

    languages: {
      type: Array,
      require: [true, "Course Language Must Be Required"],
    },

    price: {
      type: Number,
      default: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    thmubnail: {
      type: String,
      require: [true, "Course thmubnail Must Be Required"],
      unique: [true, "Course thmubnail Must Be unique"],
    },

    content: {
      type: Object,
      require: [true, "Course Content Must Be Required"],
    },

    requirements: {
      type: Array,
      require: [true, "requirements required"],
    },

    audience: {
      type: Array,
      require: [true, "Audience required"],
    },

    reviews: {
      type: Object,
      require: [true, "Course reviews Required"],
    },

    sideMeta: {
      type: Object,
      require: [true, "Course metaData Required"],
    },
  },

  { timestamps: true }
);
//create Model
const Course = mongoose.model("Course", cousreSchema);

module.exports = Course;
