const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

// file upload
const multer = require("multer");
const path = require("path");
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
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

// 미들웨어로 로그인 확인하기
function is_login(req, res, next) {
  console.log(req.session);
  if (req.session.userId) {
    console.log("YES LOGIN");
    next();
  } else {
    console.log("NO LOGIN");
    res.redirect("/user/login");
  }
}

// 로그인한 상태로 로그인, 회원가입창 들어갔을 때
function already_login(req, res, next) {
  if (req.session.userId) {
    console.log("이미 로그인 했어");
    res.redirect("/");
  } else {
    next();
  }
}

router.get("/", userController.main);

router.get("/mypage", is_login, userController.getMyPage);

router.get("/signup", already_login, userController.signup);
router.post("/signup", upload.single("myImage"), userController.signup_post);
router.post("/signup/image", upload.single("myImage"), (req, res) => {
  console.log(req.file);
  res.send("업로드");
});

router.get("/login", already_login, userController.login);
router.post("/login", userController.login_post);

module.exports = router;
