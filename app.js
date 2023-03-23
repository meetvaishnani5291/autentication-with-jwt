const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const userRoutes = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port:" + process.env.PORT);
});
