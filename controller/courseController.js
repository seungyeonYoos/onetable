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
// }

//* course mainpage
// top3
async function getBestCourses() {
  const query = `SELECT 
					  c.id,
					  c.name,
					  c.image,
            c.price,
					  COUNT(*)
					FROM course AS c INNER JOIN application AS a
					ON c.id = a.course_id
					WHERE c.date > CURDATE()
					GROUP BY c.id, c.name, c.image, c.price
					ORDER BY COUNT(*) DESC
					LIMIT 3;`;
  const bestCourses = await sequelize.query(query, { type: QueryTypes.SELECT });
  return bestCourses;
}
// top 3 아래 부분
async function getCourseDatas(q) {
  // query
  let query = "";
  // priceValue
  let priceValue;
  if (q.price == "low") priceValue = " < 50000 ";
  else if (q.price == "middle") priceValue = " BETWEEN 50000 AND 80000 ";
  else priceValue = " > 80000 ";

  if (q.order && q.month && q.price) {
    query = `SELECT 
              c.id,
              c.name,
              c.image,
              c.price,
              COUNT(*) 
            FROM course AS c LEFT OUTER JOIN ${q.order} AS a
            ON c.id = a.course_id
            WHERE c.date > CURDATE()
            AND MONTH(c.date) = '${q.month}'
            AND price ${priceValue}
            GROUP BY c.id, c.name, c.image, c.price
            ORDER BY COUNT(*) DESC;`;
  } else if (q.order && q.month) {
    query = `SELECT 
              c.id,
              c.name,
              c.image,
              c.price,
              COUNT(*)
            FROM course AS c LEFT OUTER JOIN ${q.order} AS a
            ON c.id = a.course_id
            WHERE c.date > CURDATE()
            AND MONTH(date) = '${q.month}'
            GROUP BY c.id, c.name, c.image, c.price
            ORDER BY COUNT(*) DESC;`;
  } else if (q.order && q.price) {
    query = `SELECT 
              c.id,
              c.name,
              c.image,
              c.price,
              COUNT(*)
            FROM course AS c LEFT OUTER JOIN ${q.order} AS a
            ON c.id = a.course_id
            WHERE c.date > CURDATE()
            AND price ${priceValue}
            GROUP BY c.id, c.name, c.image, c.price
            ORDER BY COUNT(*) DESC;`;
  } else if (q.month && q.price) {
    query = `SELECT * FROM course
            WHERE date > CURDATE()
            AND MONTH(date) = '${q.month}'
            AND price ${priceValue};`;
  } else if (q.order) {
    query = `SELECT
              c.id,
              c.name,
              c.image,
              COUNT(*)
            FROM course AS c LEFT OUTER JOIN ${q.order} AS a
            ON c.id = a.course_id
            WHERE c.date > CURDATE()
            GROUP BY c.id, c.name, c.image
            ORDER BY COUNT(*) DESC;`;
  } else if (q.month) {
    query = `SELECT * FROM course
            WHERE date > CURDATE()
            AND MONTH(date) = '${q.month}'`;
  } else if (q.price) {
    query = `SELECT * FROM course
            WHERE date > CURDATE()
            AND price ${priceValue};`;
  } else {
    query = `SELECT * FROM course
            WHERE date > CURDATE()
            ORDER BY id DESC;`;
  }
  const courseDatas = await sequelize.query(query, { type: QueryTypes.SELECT });
  return courseDatas;
}

exports.main = async (req, res) => {
  const bestCourse = await getBestCourses();
  console.log("bestCourse:", bestCourse);
  const courseData = await getCourseDatas(req.query);
  console.log("courseData:", courseData);

  res.render("course", { bestCourse, courseData });
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

//* 상세페이지
exports.course_detailPage = (req, res) => {
  if (req.query.courseID) {
    Course.findOne({
      where: { id: req.query.courseID },
    }).then((courseDetail) => {
      console.log("course_detailPage:", courseDetail);
      let userId = req.session.userId;
      res.render("coursein", { courseDetail, userId });
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

//* 수정부분
exports.course_updatePage = (req, res) => {
  Course.findOne({
    where: { id: req.query.courseID },
  }).then((courseDetail) => {
    console.log("courseDetail:", courseDetail);
    let userId = req.session.id;
    res.render("courseUpdate", { courseDetail, userId });
  });
};
exports.course_update = (req, res) => {
  const data = {
    name: req.body.name,
    intro: req.body.intro,
    price: req.body.price,
    hour: req.body.hour,
    date: req.body.date,
    totalNumber: req.body.totalNumber,
    user_id: req.session.userId,
  };

  if (req.file.filename) {
    data.courseImage = req.file.filename;
  }
  Course.update(data, {
    where: { id: req.body.courseID },
  }).then(() => {
    res.send(
      `<script>
        alert('수정 성공');
        location.href='/';
      </script>`
    );
  });
};
//* 삭제부분
exports.course_delete = (req, res) => {
  Course.destroy({
    where: { id: req.body.courseID },
  }).then(() => {
    res.send(
      `<script>
        alert('삭제 성공');
        location.href='/';
      </script>`
    );
  });
};
// 기대평
//* 등록
//* 수정
//* 삭제
//* 신청페이지
async function getMyInfos(userId) {
  const myInfos = await User.findOne({
    attributes: ["id", "email", "name"],
    where: { id: userId },
  });
  return myInfos;
}
async function getCourseInfos(courseID) {
  const courseInfos = await Course.findOne({
    where: { id: courseID },
  });
  return courseInfos;
}
exports.course_applyPage = async (req, res) => {
  if (req.query.courseID) {
    const myInfo = await getMyInfos(req.session.userId);
    console.log("myInfo:", myInfo);
    const courseApply = await getCourseInfos(req.query.courseID);
    console.log("courseApply:", courseApply);
    res.render("courseApply", { myInfo, courseApply });
  } else {
    res.send(
      `<script>
        alert('잘못된 접근입니다.');
        location.href='/'
      </script>`
    );
  }
};
exports.course_apply = (req, res) => {
  const data = {
    user_id: req.session.userId,
    course_id: req.query.courseID,
    tel: req.body.tel,
  };
  Application.create(data).then((result) => {
    console.log("course_apply:", result);
    res.send(true);
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
