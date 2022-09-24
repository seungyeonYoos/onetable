const express = require("express");
const courseController = require("../controller/courseController");
const router = express.Router();

router.get("/", courseController.main);

// 강좌페이지

// 강좌 등록
router.get("/register", courseController.course_registerPage);
router.post("/register", courseController.course_register);

// 강좌 신청
router.post("/apply", courseController.course_apply);

// 강좌 보여주려면 결국 findAll
router.get("/show", courseController.course_show);
router.get("/show/myRegister", courseController.course_show_myRegister);
router.get("/show/myApply", courseController.course_show_myApply);

module.exports = router;
