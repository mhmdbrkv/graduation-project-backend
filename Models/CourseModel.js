const mongoose = require("mongoose");

//create schema
const cousreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Course Must Be Required"],
      unique: [true, "Course Must Be unique"],
      minLength: [12, "Too Short"],
      maxlength: [100, "Too Long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);
//create Model
const CourseModel = mongoose.model("Course", cousreSchema);

module.exports = CourseModel;
