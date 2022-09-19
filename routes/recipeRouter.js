const express = require("express");
const recipeController = require("../controller/recipeController");
const router = express.Router();

router.get("/", recipeController.main);

module.exports = router;
