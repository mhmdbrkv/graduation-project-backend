const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      require: [true, "User first  name is required"],
      trim: true,
      minLength: [3, "User name must be at least 3 characters"],
    },
    lastname: {
      type: String,
      trim: true,
      minLength: [3, "User name must be at least 3 characters"],
    },
    email: {
      type: String,
      require: [true, "User email required"],
      unique: [true, "User email must be unique"],
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
      require: [true, "User password required"],
      minLength: [6, "User name must be at least 6 characters"],
    },

    myLearning: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
    myCourses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],

    headline: {
      type: String,
      maxlength: [60, "Headline must be less than 60 characters"],
    },
    biography: String,
    social: [String],
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },
    isActive: { type: Boolean, default: true },
    passChangedAt: Date,
    passResetCode: String,
    passResetCodeEat: Date,
    passResetCodeVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 11);
  next();
});

module.exports = mongoose.model("User", userSchema);
