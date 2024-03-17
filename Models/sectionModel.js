const mongoose = require("mongoose");

//create schema for lecture
const lectureSchema = new mongoose.Schema({
  lectureName: {
    type: String,
    require: [true, "lecture's name required"],
  },

  lectureUrl: {
    type: String,
    require: [true, "lecture's url required"],
  },
});

//create schema for course content
const sectionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    require: [true, "course id is required"],
  },
  sectionName: {
    type: String,
    require: [true, "section's name required"],
  },
  lectures: [lectureSchema],
});

module.exports = mongoose.model("Section", sectionSchema);
