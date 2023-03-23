const User = require("../models/user");
const {
  ValidationError,
  AutenticationError,
  DBError,
} = require("../utils/error");
const { validationResult } = require("express-validator");

exports.getRegister = async (req, res, next) => {
  try {
    res.render("register", { message: undefined, isLoggedin: false });
  } catch (error) {
    next(error);
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      throw new ValidationError(validationError.errors[0].msg);
    }
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    const { status, message } = await User.register(user);
    res.render("register", { message, isLoggedin: false });
  } catch (error) {
    next(error);
  }
};

exports.getLogin = (req, res, next) => {
  try {
    res.render("login", { message: undefined, isLoggedin: false });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const { refreshToken, accessToken } = await User.login(user);
    res.cookie("access-token", accessToken);
    res.cookie("refresh-token", refreshToken);

    res.render("login", { message, isLoggedin: false });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    res.clearCookie("auth-token");
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

exports.getHomepage = (req, res, next) => {
  res.render("index", { isLoggedin: true, name: req.user.name });
};
exports.getNewToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies["refresh_token"];
    const userEmail = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = User.fetchUser({ email: userEmail });
    if (user === undefined) throw new DBError("user not found");
    const newAccessToken = jwt.sign(
      { name: user.name, email: user.email },
      process.env.ACCESS_TOKEN_SECRET
    );
    req.cookie("access-token", newAccessToken);
    res.redirect("/");
  } catch (error) {
    next(new AutenticationError("Unauthorised access"));
  }
};
