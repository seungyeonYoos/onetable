const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router.get("/", userController.main);

router.get("/signup", userController.signup);
router.post("/signup", userController.signup_post);

router.get("/login", userController.login);
router.post("/login", userController.login_post);

module.exports = router;
