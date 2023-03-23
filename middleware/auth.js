const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { AutenticationError, DBError } = require("../utils/error");

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.cookies["access-token"];
    const loggedUser = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log("======auth-midle========", accessToken);
    console.log(loggedUser);
    const user = await User.fetchUser(loggedUser);
    if (user === undefined) throw new DBError("user not found");
    req.user = user;
  } catch (error) {
    console.log(error);
    if (error instanceof DBError) {
      next(error);
    } else {
      res.redirect("/refresh");
    }
  }
};
