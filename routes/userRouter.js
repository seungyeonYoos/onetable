const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

// 미들웨어로 로그인 확인하기
// function is_login(req, res, next) {
//   console.log(req.session);
//   console.log(req.session.id, req.session.user);
//   if (req.session.user) {
//     console.log("YES LOGIN");
//     next();
//   } else {
//     console.log("NO LOGIN");
//     res.redirect("/user/login");
//   }
// }

router.get("/", userController.main);
router.get("/mypage", userController.getMyPage);

router.get("/signup", userController.signup);
router.post("/signup", userController.signup_post);

router.get("/login", userController.login);
router.post("/login", userController.login_post);

module.exports = router;
