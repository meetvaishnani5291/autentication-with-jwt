const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  ValidationError,
  AutenticationError,
  DBError,
} = require("../utils/error");
const { validationResult } = require("express-validator");

exports.getRegister = async (req, res, next) => {
  console.log("===========register==========", req.locals);
  try {
    if (res.locals.message === undefined) {
      res.render("register", { message: undefined, isLoggedin: false });
    } else {
      res.render("register");
    }
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
  console.log("====get-login=========", res.locals);
  try {
    if (res.locals.message === undefined) {
      res.render("login", { message: undefined, isLoggedin: false });
    } else {
      res.render("login");
    }
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
    const { name, refreshToken, accessToken } = await User.login(user);
    res.cookie("access-token", accessToken);
    res.cookie("refresh-token", refreshToken);
    res.locals.message = undefined;
    res.locals.name = name;
    res.locals.isLoggedin = true;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

exports.getHomepage = (req, res, next) => {
  res.render("index", { isLoggedin: true, name: req.user.name });
};
exports.getNewToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    const verifiedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.fetchUser({ email: verifiedRefreshToken.email });
    if (user === undefined) throw new DBError("user not found");
    console.log("user", user);
    const newAccessToken = jwt.sign(
      { name: user.name, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    res.cookie("access-token", newAccessToken);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    next(new AutenticationError("Unauthorised access"));
  }
};
