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
exports.main = (req, res) => {
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
  Application.create(data1).then((result) => {
    console.log("course_apply:", result);
  });
};
