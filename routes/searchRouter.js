const express = require("express");
const searchController = require("../controller/searchController");
const router = express.Router();

router.get("/", searchController.main);

module.exports = router;
