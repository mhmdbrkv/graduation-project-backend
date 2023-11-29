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
      maxlength: [500, "Too Long"],
    },
    priefDesc: {
      type: String,
      require: [true, "Course prief Must Be Required"],
      minLength: [12, "Too Short"],
      maxlength: [1000, "Too Long"],
    },
    description: {
      type: String,
      require: [true, "Course Description Must Be Required"],
      minLength: [12, "Too Short"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    totalHours: {
      type: Number,
      require: [true, "Course total hours Must Be Required"],
    },
    category: {
      type: Schema.ObjectId,
      require: [true, "Category required"],
    },
    learningGoals: {
      type: Array,
      require: [true, "Course target Be Required"],
    },
    enrolledNum: {
      type: Number,
      require: [true, "Course enrolled numbers Must Be Required"],
    },
    rating: {
      type: Number,
      require: [true, "Course rating Must Be Required"],
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
    Requirements: {
      type: Array,
      require: [true, "Course Requirements Must Be Required"],
    },
    reviews: {
      type: Array,
    },
    sideMeta: {
      type: Array,
      require: [true, "Course metaData Must Be Required"],
    },
  },

  { timestamps: true }
);
//create Model
const CourseModel = mongoose.model("Course", cousreSchema);

module.exports = CourseModel;
