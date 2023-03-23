const { ValidationError, AutenticationError } = require("../utils/error");

module.exports = (error, req, res, next) => {
  if (error instanceof AutenticationError) {
    res.render("login", {
      message: error.message,
      isLoggedin: false,
    });
  } else if (error instanceof ValidationError) {
    res.render("register", {
      message: error.message,
      isLoggedin: false,
    });
  } else {
    console.log(error);
    res.send("hiiiii");
  }
};
