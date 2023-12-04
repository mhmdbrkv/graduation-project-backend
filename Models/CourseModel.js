const mongoose = require("mongoose");

//create schema

const Schema = mongoose.Schema;

const cousreSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, "Course title Must Be Required"],
      unique: [true, "Course title Must Be unique"],
      minLength: [12, "Too Short"],
      maxlength: [150, "Too Long"],
    },
    priefDesc: {
      type: String,
      require: [true, "Course prief Must Be Required"],
      minLength: [32, "Too Short"],
      maxlength: [500, "Too Long"],
    },

    description: {
      type: String,
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
      type: Schema.ObjectId,
      require: [true, "Category required"],
    },

    learningGoals: {
      type: String,
    },
    enrolledNum: {
      type: Number,
    },
    ratingNum: {
      type: Number,
    },
    instructor: {
      type: String,
      require: [true, "Course instructor Must Be Required"],
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
      type: Array,
      require: [true, "Course Content Must Be Required"],
    },

    requirements: {
      type: String,
    },
    reviews: {
      type: Object,
    },

    sideMeta: {
      type: String,
    },
    
    //file names
    descFileName: {
      type: String,
      require: [true, "Course Description FileName Must Be Required"],
      unique: [true, "Course Description FileName Must Be unique"],
    },

    learningGoalsFileName: {
      type: String,
      require: [true, "Course LearningGoals FileName Required"],
      unique: [true, "Course LearningGoals FileName Must Be unique"],
    },

    requirementsFileName: {
      type: String,
      require: [true, "Course Requirements Required"],
    },
    sideMetaFileName: {
      type: String,
      require: [true, "Course metaData Must Be Required"],
    },
  },

  { timestamps: true }
);
//create Model
const CourseModel = mongoose.model("Course", cousreSchema);

module.exports = CourseModel;
