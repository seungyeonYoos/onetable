const express = require("express");
const courseController = require("../controller/courseController");
const router = express.Router();

router.get("/", courseController.main);

// 강좌페이지

// 강좌 등록
router.post("/register", courseController.course_register);

// 강좌 보여주려면 결국 findAll
// router.get("/myregister", courseController.course_show);

module.exports = router;
