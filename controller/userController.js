const { User } = require("../model");
const { UserLikes } = require("../model");
const { UserWishList } = require("../model");

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
    if (result) res.send(true);
    else res.send(false);
  });
};
