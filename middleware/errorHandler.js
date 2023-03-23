const {
  ValidationError,
  AutenticationError,
  DBError,
} = require("../utils/error");

module.exports = (error, req, res, next) => {
  if (error instanceof AutenticationError) {
    res.locals.message = error.message;
    res.locals.isLoggedin = false;
    res.status(401).redirect("/login");
  } else if (error instanceof ValidationError) {
    res.locals.message = error.message;
    res.locals.isLoggedin = false;
    res.status(403).redirect("/register");
  } else if (error instanceof DBError) {
    res.locals.message = error.message;
    res.locals.isLoggedin = false;
    res.status(403).redirect("/login");
  } else {
    console.log(error);
    res.status(503).send("Server error");
  }
};
