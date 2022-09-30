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
      done(null, req.session.id + Date.now() + ext);
      // done(nul, req.body.name + ext);
      // done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 미들웨어로 로그인 확인하기
function is_login(req, res, next) {
  console.log(req.session);
  if (req.session.userId) {
    console.log("YES LOGIN");
    next();
  } else {
    console.log("NO LOGIN");
    // res.redirect("/user/login");
    res.send(
      "<script>alert('로그인이 필요한 페이지입니다.');location.href='/user/login';</script>"
    );
  }
}

// 강좌 메인페이지
router.get("/", courseController.main);

// 강좌 등록
router.get("/register", is_login, courseController.course_registerPage);
router.post(
  "/register",
  upload.single("courseImage"),
  courseController.course_register
);

// 강좌 상세페이지
router.get("/detail", courseController.course_detailPage);
// 강좌 삭제
router.post("/delete", courseController.course_delete);
// 강좌 수정
router.get("/update", is_login, courseController.course_updatePage);
router.post(
  "/update",
  upload.single("courseImage"),
  courseController.course_update
);
//* 좋아요
// 좋아요 등록
router.post("/fregister", courseController.courseFavorite_register);
// 좋아요 삭제
router.post("/fdelete", courseController.CourseFavorite_delete);

//* 기대평
// 댓글 등록
router.post("/rregister", courseController.courseReview_register);
// 댓글 수정
// 댓글 삭제

// 강좌 신청
router.get("/apply", is_login, courseController.course_applyPage);
router.post("/apply", courseController.course_apply);

module.exports = router;
