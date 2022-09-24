const { User } = require("../model");

// exports.get_visitors = (req, res) => {
//   //sql문: SELECT * FROM visitor;
//   Visitor.findAll().then((result) => {
//     console.log("result : ", result);
//     console.log("index");
//     res.render("index", { data: result });
//   });
// };

exports.main = (req, res) => {
  res.render("");
};

// 회원가입 페이지
exports.signup = (req, res) => {
  res.render("signup");
};
exports.signup_post = (req, res) => {
  console.log(req.file);
  let data = {
    email: req.body.email,
    pw: req.body.pw,
    name: req.body.name,
    image: req.file.filename,
  };
  User.create(data).then((result) => {
    console.log("create:", result);
    res.send(true);
  });
};

// 로그인 페이지
exports.login = (req, res) => {
  res.render("login");
};

exports.login_post = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
      pw: req.body.pw,
    },
  }).then((result) => {
    console.log("Login_findOne:", result);
    if (result) {
      req.session.userId = result.id;
      // res.redirect("/");
      console.log(req.session);
      res.send(true);
    } else res.send(false);
  });
};

// 마이페이지
exports.myPage = (req, res) => {
  User.findOne({
    where: { id: req.session.userId },
  }).then((result) => {
    console.log("Mypage_findOne:", result);
    res.render("mypage", { myInfo: result });
  });
};

exports.myPage_edit = (req, res) => {
  let data1 = {
    email: req.body.email,
    pw: req.body.pw,
    name: req.body.name,
    // image: req.file.filename,
  };
  User.update(data1, {
    where: { id: req.body.userId },
  }).then((result) => {
    console.log("update:", result);
    res.send("회원정보 수정 성공!");
  });
};

// exports.myPage_delete = (req, res) => {
//   User.destroy({
//     where: { id: req.session.userId },
//   }).then(() => {
//     res.redirect("/");
//   });
// };

//* 마이페이지 (보여주는 부분)
