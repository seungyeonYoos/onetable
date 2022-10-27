const { QueryTypes } = require("sequelize");
const { User, Recipe, Favorite, Course, sequelize } = require("../model");

// 회원가입 페이지
exports.signup = (req, res) => {
  res.render("signup", { popup: req.cookies.popup });
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
  res.render("login", { popup: req.cookies.popup });
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

//로그아웃
exports.logout = (req, res) => {
  if (req.session.userId) {
    req.session.destroy(function () {
      res.send(
        `<script>
          location.href='/';
        </script>`
      );
    });
  } else {
    res.send(
      `<script>
        alert('잘못된 접근입니다.');
        location.href='/'
      </script>`
    );
  }
};

// 마이페이지 보여주기
// 내정보
async function getMyInfos(userId) {
  const myInfos = await User.findOne({
    where: { id: userId },
  });
  return myInfos;
}
//user가 작성한 레시피들 검색
async function getMyRecipes(userId) {
  const myRecipes = await Recipe.findAll({
    raw: true,
    attributes: ["id", "title", "image"],
    where: { user_id: userId },
  });
  return myRecipes;
}
//user가 좋아요한 레시피들 검색
async function getFavRecipes(userId) {
  const favRecipes = await Favorite.findAll({
    raw: true,
    attributes: ["recipe_id"],
    where: { user_id: userId },
    include: [
      {
        model: Recipe,
        attributes: ["title", "image"],
        required: false,
      },
    ],
  });
  return favRecipes;
}
// user가 등록한 클래스들 검색
async function getMyCourses(userId) {
  const myCourses = await Course.findAll({
    attributes: ["id", "name", "image"],
    where: { user_id: userId },
  });
  return myCourses;
}
//user가 좋아요한 클래스들 검색
async function getFavCourses(userId) {
  const query = `SELECT 
                  c.id,
                  c.name,
                  c.image
                FROM course AS c LEFT OUTER JOIN coursefavorite AS cf
                ON c.id = cf.course_id
                WHERE cf.user_id = ${userId};`;
  const favCourses = await sequelize.query(query, { type: QueryTypes.SELECT });
  return favCourses;
}
//user가 신청한 클래스들 검색
async function getApplyCourses(userId) {
  const query = `SELECT 
                  c.id,
                  c.name,
                  c.image
                FROM course AS c LEFT OUTER JOIN application AS a
                ON c.id = a.course_id
                WHERE a.user_id = ${userId};`;
  const applyCourses = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return applyCourses;
}
async function getCourseReviews(userId) {
  const query = `SELECT cr.course_id, c.name, cr.comment
                FROM coursereview AS cr INNER JOIN course AS c
                ON cr.course_id = c.id
                WHERE cr.user_id = ${userId};`;
  const courseReviews = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return courseReviews;
}

exports.myPage = async (req, res) => {
  const myInfo = await getMyInfos(req.session.userId);
  console.log("myInfo:", myInfo);
  const myRecipe = await getMyRecipes(req.session.userId);
  console.log("myRecipe:", myRecipe);
  const favRecipe = await getFavRecipes(req.session.userId);
  console.log("favRecipe:", favRecipe);
  const myCourse = await getMyCourses(req.session.userId);
  console.log("myCourse:", myCourse);
  const favCourse = await getFavCourses(req.session.userId);
  console.log("favCourse:", favCourse);
  const applyCourse = await getApplyCourses(req.session.userId);
  console.log("applyCourse:", applyCourse);
  const courseReview = await getCourseReviews(req.session.userId);
  console.log("courseReview:", courseReview);
  res.render("mypage", {
    myInfo,
    myRecipe,
    favRecipe,
    myCourse,
    favCourse,
    applyCourse,
    courseReview,
    popup: req.cookies.popup,
  });
};

// 마이페이지 내 정보 수정하기
exports.myPage_edit = (req, res) => {
  const data = {
    email: req.body.email,
    pw: req.body.pw,
    name: req.body.name,
  };
  if (req.file) {
    data.image = req.file.filename;
  }
  User.update(data, {
    where: { id: req.session.userId },
  }).then((result) => {
    console.log("myPage_edit:", result);
    res.send(result);
  });
};

// 마이페이지 내 정보 삭제하기(탈퇴기능)
exports.myPage_delete = (req, res) => {
  User.destroy({
    where: { id: req.session.userId },
  }).then((result) => {
    console.log("myInfo destroy:", result);
    req.session.destroy();
    res.redirect("/");
    //? 로그아웃 기능도 같이 넣어줘야 하는지 확인 필요!
  });
};
