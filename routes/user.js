const path = require("path");

const express = require("express");
const cookieParser = require("cookie-parser");

const autenticateUser = require("../middleware/auth");
const { validateUser } = require("../middleware/validation");
const userController = require("../controllers/user");

const router = express.Router();

router.use(cookieParser());

router.use(express.static(path.join(__dirname, "..", "public")));

router.get("/register", userController.getRegister);

router.post("/register", validateUser, userController.postRegister);

router.get("/login", userController.getLogin);

router.post("/login", userController.postLogin);

router.get("/logout", userController.logout);

router.get("/", autenticateUser, userController.getHomepage);

router.get("/refresh", userController.getNewToken);

module.exports = router;
