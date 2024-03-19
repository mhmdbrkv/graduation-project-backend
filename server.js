const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./Middlewares/errorMiddleware");
const dbConnection = require("./config/database");

const mountRoutes = require("./Routes");

//database connection
dbConnection();

//express app
const app = express();

//middlewares
app.use(compression());
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//router mount
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`There is no such route: ${req.originalUrl}`, 400));
});

// Global Error Handler Middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;

//listen server
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
