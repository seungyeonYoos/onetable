const { User } = require("../model");

// exports.get_visitors = (req, res) => {
//   //sql문: SELECT * FROM visitor;
//   Visitor.findAll().then((result) => {
//     console.log("result : ", result);
//     console.log("index");
//     res.render("index", { data: result });
//   });
// };

// exports.is_login = (req, res, next) => {
//   console.log(req.session);
//   console.log(req.session.id, req.session.user);
//   if (req.session.user) {
//     console.log("YES LOGIN");
//     next();
//   } else {
//     console.log("NO LOGIN");
//     res.redirect("/user/login");
//   }
// };

exports.main = (req, res) => {
  res.render("");
};

// 회원가입 페이지
exports.signup = (req, res) => {
  console.log(req.session);
  res.render("signup");
};
exports.signup_post = (req, res) => {
  let data = {
    email: req.body.email,
    pw: req.body.pw,
    name: req.body.name,
    photo: req.body.photo,
  };
  User.create(data).then((result) => {
    console.log("create:", result);
    res.send(true);
  });
};

// 로그인 페이지
exports.login = (req, res) => {
  console.log(req.session.user);
  res.render("login");
};

exports.login_post = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
      pw: req.body.pw,
    },
  }).then((result) => {
    console.log("findOne:", result);
    if (result) {
      res.send(true);
      req.session.user = result.id;
      // res.redirect("/");
      console.log(req.session);
      console.log(req.session.id, req.session.user);
    } else res.send(false);
  });
};
