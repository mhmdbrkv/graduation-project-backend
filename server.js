const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
const courseRoute = require("./Routes/CourseRoute");

//database connection
dbConnection();
//express app
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routr mount
app.use("/api/v1/courses", courseRoute);

//listen server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app running on this ${PORT}`);
});
