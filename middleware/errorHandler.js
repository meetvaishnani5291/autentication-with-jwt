const {
  ValidationError,
  AutenticationError,
  DBError,
} = require("../utils/error");

module.exports = (error, req, res, next) => {
  console.log(error);
  if (error instanceof AutenticationError) {
    res.cookie("message", error.message);
    res.cookie(error.message);
    console.log("=======before-redirect==========", res.locals);
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
