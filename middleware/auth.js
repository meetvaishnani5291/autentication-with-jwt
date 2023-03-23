const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { AutenticationError, DBError } = require("../utils/error");

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.cookies["auth-token"];
    const loggedUser = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.fetchUser(loggedUser);
    if (user === undefined) throw DBError("user not found");
    req.user = user;
  } catch (error) {
    if (error instanceof DBError) next(error);
    else next(new AutenticationError("session expired"));
  }
};
