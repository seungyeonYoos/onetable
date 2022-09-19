const express = require("express");
const globalController = require("../controller/globalController");
const router = express.Router();

router.get("/", globalController.main);

module.exports = router;
