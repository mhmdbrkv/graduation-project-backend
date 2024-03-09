const mongoose = require("mongoose");

//create schema

const cousreSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "Course title Must Be unique"],
      require: [true, "Course title Required"],
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

    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],

    learningGoals: {
      type: [String],
      require: [true, "learning Goals required"],
    },

    enrolledNumber: {
      type: Number,
    },

    ratingsNumber: {
      type: Number,
      default: 0,
    },

    avgRatings: {
      type: Number,
      default: 0,
    },

    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "Course instructor id Required"],
    },

    languages: {
      type: [String],
      require: [true, "Course Language Must Be Required"],
    },

    price: {
      type: Number,
      default: 0,
      trim: true,
      require: [true, "Course price required"],
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    thmubnail: {
      type: String,
      require: [true, "Course thmubnail required"],
    },

    content: [
      {
        name: {
          type: String,
          require: [true, "Content lesson's name is required"],
          unique: [true, "lesson name Must Be unique"],
          minLength: [6, "Too Short name"],
          maxlength: [32, "Too Long name"],
        },

        duration: {
          type: Number,
        },

        link: {
          type: String,
          require: [true, "Lesson link is required"],
        },
      },
    ],

    requirements: {
      type: [String],
      require: [true, "requirements required"],
    },

    level: {
      type: String,
      require: [true, "Audience required"],
    },

    sideMeta: {
      type: [String],
      require: [true, "Course metaData Required"],
    },
  },

  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual property for getting the reviews of the course with the response
cousreSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "course",
  localField: "_id",
});

// mongoose query middleware for population
cousreSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

// return thmubnail url with the response
cousreSchema.post("init", (doc) => {
  if (doc.thmubnail) {
    const thmubnailUrl = `${process.env.BASE_URL}/courses/${doc.thmubnail}`;
    doc.thmubnail = thmubnailUrl;
  }
});

//create Model
module.exports = mongoose.model("Course", cousreSchema);
