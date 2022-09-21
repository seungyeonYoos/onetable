const express = require("express");
const reviewController = require("../controller/reviewController");
const router = express.Router();

router.get("/", reviewController.main);

module.exports = router;
