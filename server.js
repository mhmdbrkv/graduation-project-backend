const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./Middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const courseRoute = require("./Routes/courseRoute");
const categoryRoute = require("./Routes/categoryRoute");

//database connection
dbConnection();

//express app
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

app.use("/assets", express.static(__dirname + "/assets"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//routr mount
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/categories", categoryRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`There is no such route: ${req.originalUrl}`, 400));
});

// Global Error Handler Middleware
app.use(globalError);

//listen server
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`app running on this ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting Down...");
    process.exit(1);
  });
});
