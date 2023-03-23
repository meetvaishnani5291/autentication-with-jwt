const { body } = require("express-validator");

module.exports.validateUser = [
  body("email", "Email length should be 10 to 30 characters")
    .isEmail()
    .isLength({ min: 10, max: 30 }),
  body("name", "Name length should be 10 to 20 characters").isLength({
    min: 5,
  }),
  body("password", "Password length should be 8 to 10 characters").isLength({
    min: 8,
    max: 10,
  }),
];
