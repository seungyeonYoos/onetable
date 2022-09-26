const express = require("express");
const courseController = require("../controller/courseController");
const router = express.Router();

// file upload
const multer = require("multer");
const path = require("path");
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/courseIMG/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, req.session.id + ext);
      // done(nul, req.body.name + ext);
      // done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 강좌 메인페이지
router.get("/", courseController.main);

// 강좌 등록
router.get("/register", courseController.course_registerPage);
router.post(
  "/register",
  upload.single("courseImage"),
  courseController.course_register
);

// 강좌 신청
router.get("/apply", courseController.course_applyPage);
router.post("/apply", courseController.course_apply);

// 강좌 보여주려면 결국 findAll
// router.get("/show", courseController.course_show);
router.get("/show/myRegister", courseController.course_show_myRegister);
router.get("/show/myApply", courseController.course_show_myApply);

module.exports = router;
