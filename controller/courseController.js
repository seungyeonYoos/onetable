const { query } = require("express");
const { QueryTypes } = require("sequelize");
const {
  Course,
  User,
  Application,
  ClassFavorite,
  ClassReview,
  sequelize,
} = require("../model");

//* course main페이지
// 이건 다 찾아주는 거
// exports.main = (req, res) => {
//   Course.findAll({}).then((result) => {
//     console.log("findAll:", result);
//     res.render("course", { courseData: result });
//   });
// };

// RAW QUERY 사용하는 것
// exports.main = async (req, res) => {
//   const query = `SELECT
//                   c.id,
//                   c.name,
//                   c.image,
//                   COUNT(*)
//                 FROM course AS c INNER JOIN application AS a
//                 ON c.id = a.course_id
//                 WHERE c.date > CURDATE()
//                 GROUP BY c.id, c.name, c.image
//                 ORDER BY COUNT(*) DESC
//                 LIMIT 10;`;
//   const result = await sequelize.query(query, { type: QueryTypes.SELECT });
//   console.log("courseData", result);
//   res.render("index", { courseData: result });
// };

//* course mainpage
exports.main = async (req, res) => {
  //?질문? 이런식으로 하는 게 맞는지(월은 12개이고 그럼 경우의 수가 너무 많은데 그건 어떻게 해야할지.....ㅎㅎ notion 보면서 질문)w
  // let query = "";
  // if (req.query.order == "register") {
  //   query = `SELECT *
  //                 FROM onetable.course
  //                 WHERE date > CURDATE()
  //                 ORDER BY id DESC;`;
  // } else {
  //   query = `SELECT
  //                 c.id,
  //                 c.name,
  //                 c.image,
  //                 COUNT(*)
  //               FROM course AS c INNER JOIN ${req.query.order} AS a
  //               ON c.id = a.course_id
  //               WHERE c.date > CURDATE()
  //               GROUP BY c.id, c.name, c.image
  //               ORDER BY COUNT(*) DESC;`;
  // }
  // let result = await sequelize.query(query, { type: QueryTypes.SELECT });
  // res.render("course", { result });
  // // if (req.query.order == "register") {
  // //   let query = `SELECT *
  // //                 FROM onetable.course
  // //                 WHERE date > CURDATE()
  // //                 ORDER BY id DESC;`;
  // //   let result = await sequelize.query(query, { type: QueryTypes.SELECT });
  // //   return result;
  // // } else if (req.query.order == "application") {
  // //   let query = `SELECT
  // //                 c.id,
  // //                 c.name,
  // //                 c.image,
  // //                 COUNT(*)
  // //               FROM course AS c INNER JOIN ${req.query.order} AS a
  // //               ON c.id = a.course_id
  // //               WHERE c.date > CURDATE()
  // //               GROUP BY c.id, c.name, c.image
  // //               ORDER BY COUNT(*) DESC;`;
  // //   let result = await sequelize.query(query, { type: QueryTypes.SELECT });
  // //   return result;
  // // } else if (req.query.order == "like") {
  // //   let query = `SELECT
  // //                 c.id,
  // //                 c.name,
  // //                 c.image,
  // //                 COUNT(*)
  // //               FROM course AS c INNER JOIN application AS a
  // //               ON c.id = a.course_id
  // //               WHERE c.date > CURDATE()
  // //               GROUP BY c.id, c.name, c.image
  // //               ORDER BY COUNT(*) DESC;`;
  // //   let result = await sequelize.query(query, { type: QueryTypes.SELECT });
  // //   return result;
  // // }
  res.render("course");
};

//* 등록부분
exports.course_registerPage = (req, res) => {
  res.render("courseRegister");
};
exports.course_register = (req, res) => {
  const data = {
    name: req.body.name,
    image: req.file.filename,
    intro: req.body.intro,
    price: req.body.price,
    hour: req.body.hour,
    date: req.body.date,
    totalNumber: req.body.totalNumber,
    user_id: req.session.userId,
  };
  Course.create(data).then((result) => {
    console.log("course_register:", result);
    res.send(true);
  });
};

//* 신청페이지
exports.course_applyPage = (req, res) => {
  res.render("courseApply");
};
exports.course_apply = (req, res) => {
  const data1 = {
    user_id: req.body.userId,
    // req.session.userId
    course_id: req.body.courseId,
  };
  //?질문? course_id 어떻게 받아와야 할지 생각하고 질문
  Application.create(data1).then((result) => {
    console.log("course_apply:", result);
  });
};

//* 상세페이지
exports.course_detailPage = (req, res) => {
  Course.findOne({
    where: { id: req.query.courseID },
  }).then((result) => {
    console.log("course_detailPage:", result);
    res.render("coursein", { courseDetail: result });
  });
};

// exports.login_post = (req, res) => {
//   User.findOne({
//     where: {
//       email: req.body.email,
//       pw: req.body.pw,
//     },
//   }).then((result) => {
//     console.log("Login_findOne:", result);
//     if (result) {
//       req.session.userId = result.id;
//       // res.redirect("/");
//       console.log(req.session);
//       res.send(true);
//     } else res.send(false);
//   });
// };
