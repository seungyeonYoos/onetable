const { User, Recipe, Favorite } = require("../model");

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

// 로그인 페이지(로그아웃은 아마 session에서 session.userId만 빼주면 될듯)
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

// 마이페이지 내정보 보여주기
exports.myPage = async (req, res) => {
  //user가 작성한 레시피들 검색
  const myRecipes = await Recipe.findAll({
    raw: true,
    attributes: ["id", "title", "image"],
    where: { user_id: req.session.userId },
  });
  //user가 좋아요한 레시피들 검색
  const favRecipes = await Favorite.findAll({
    raw: true,
    attributes: ["recipe_id"],
    where: { user_id: req.session.userId },
    include: [
      {
        model: Recipe,
        attributes: ["title", "image"],
        required: false,
      },
    ],
  });

  User.findOne({
    where: { id: req.session.userId },
  }).then((result) => {
    console.log("작성 및 좋아요 레시피들:", myRecipes, favRecipes);
    console.log("Mypage_findOne:", result);
    res.render("mypage", { myInfo: result, myRecipes, favRecipes });
    //* To. 미경
    //* 마이페이지 창 들어갔을 때
    //* 콘솔창에 "Mypage_findeOne: ~~~~ " 라고 뜨는 정보를 내가
    //* myInfo변수를 mypage.ejs로 바로 보내고 있어
    //* <%= myInfo.email %> 이렇게 ejs 문법 사용해서 나타내면 됩니다~
    //* 너랑 나랑 mysql db가 달라서 너가 user table에 정보가 있어야 뜰거야.
    //* 그리고 사진은 너가 직접 회원가입창에서 사진 넣고 회원가입하면 session.id로
    //* image value값도 저장되고(근데 여기는 이름만 저장되는거야 사진은 없어)
    //* uploads폴더에 사진 저장돼(이름은 session.id로 똑같아)
    //* image value값을 myInfo 변수로 받아서 uploads에 있는 폴더 경로로 받으면 될거야
  });
};

// 마이페이지 내 정보 수정하기
exports.myPage_edit = (req, res) => {
  let data1 = {
    email: req.body.email,
    pw: req.body.pw,
    name: req.body.name,
    image: req.file.filename,
  };
  User.update(data1, {
    where: { id: req.session.userId },
  }).then((result) => {
    console.log("update:", result);
    res.send("회원정보 수정 성공!");
  });
};

// 마이페이지 내 정보 삭제하기(탈퇴기능)
// exports.myPage_delete = (req, res) => {
//   User.destroy({
//     where: { id: req.session.userId },
//   }).then((result) => {
// 	   console.log("myInfo destroy:", result)
//     res.redirect("/");
//   });
// };

//* 마이페이지 (보여주는 부분)
