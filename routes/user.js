const path = require("path");

const express = require("express");

const autenticateUser = require("../middleware/auth");
const { validateUser } = require("../middleware/validation");
const userController = require("../controllers/user");

const router = express.Router();

router.use(express.static(path.join(__dirname, "..", "public")));

router.use("/register", userController.getRegister);

router.post("/post-register", validateUser, userController.postRegister);

router.use("/login", userController.getLogin);

router.post("/post-login", userController.postLogin);

router.get("/logout", userController.logout);

router.get("/", autenticateUser, userController.getHomepage);

router.get("/refresh", userController.getNewToken);

module.exports = router;
