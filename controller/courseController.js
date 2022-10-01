const { query } = require("express");
const { QueryTypes } = require("sequelize");
const {
  Course,
  User,
  Application,
  CourseFavorite,
  CourseReview,
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
              c.price,
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

// coursefavorite테이블에서 user_id로 본인이 누른 coursefavorite정보 보내기
async function getMyCourseFavorites(userId) {
  const myCourseFavorites = await CourseFavorite.findAll({
    where: { user_id: userId },
  });
  return myCourseFavorites;
}
// coursefavorite테이블로 좋아요수 보내기
async function countCourseFavorites() {
  const query = `SELECT *, COUNT(*) AS count
                FROM coursefavorite 
                GROUP BY course_id;`;
  const courseFavorites = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return courseFavorites;
}
exports.courseFavorite_main = async (req, res) => {
  let myCourseFavorite;
  if (req.session.userId) {
    myCourseFavorite = await getMyCourseFavorites(req.session.userId);
  } else {
    myCourseFavorite = [];
  }
  console.log("myCourseFavorite:", myCourseFavorite);
  const countCourseFavorite = await countCourseFavorites();
  console.log("countCourseFavorite:", countCourseFavorite);
  let data = { myCourseFavorite, countCourseFavorite };
  res.send(data);
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
async function getDetailPages(courseID) {
  const detailPages = await Course.findOne({
    where: { id: courseID },
  });
  return detailPages;
}
// 신청자수 보내자
async function getCountApplications(courseID) {
  const query = `SELECT *, COUNT(*) AS count
                FROM Application
                WHERE application.course_id = ${courseID}
                GROUP BY course_id;`;
  const countApplications = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return countApplications;
}
// 기대평 보여주는 부분
async function getCourseReviews(courseID) {
  const query = `SELECT 
                  cr.id, cr.course_id, cr.user_id, u.name, cr.comment
                FROM user AS u INNER JOIN coursereview AS cr
                ON u.id = cr.user_id
                WHERE cr.course_id = ${courseID};`;
  const courseReviews = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return courseReviews;
}
exports.course_detailPage = async (req, res) => {
  if (req.query.courseID) {
    const courseDetail = await getDetailPages(req.query.courseID);
    console.log("courseDetail:", courseDetail);
    let userId = req.session.userId;
    console.log("userId:", userId);
    const countApplication = await getCountApplications(req.query.courseID);
    console.log("countApplication:", countApplication);
    const courseReview = await getCourseReviews(req.query.courseID);
    console.log("courseReview:", courseReview);
    res.render("coursein", {
      courseDetail,
      userId,
      countApplication,
      courseReview,
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

  if (req.file) {
    data.image = req.file.filename;
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

// 좋아요
//* 등록
exports.courseFavorite_register = (req, res) => {
  const data = {
    user_id: req.session.userId,
    course_id: req.body.courseID,
  };
  CourseFavorite.create(data).then((result) => {
    console.log("course_register:", result);
    res.send("좋아요 확인");
  });
};
//* 삭제
exports.CourseFavorite_delete = (req, res) => {
  CourseFavorite.destroy({ where: { course_id: req.body.courseID } }).then(
    () => {
      res.send("좋아요 취소");
    }
  );
};

// 기대평
//* 등록
async function registerCourseReviews(req) {
  const data = {
    user_id: req.session.userId,
    course_id: req.body.courseID,
    comment: req.body.comment,
  };
  const courseReviews = await CourseReview.create(data);
  return courseReviews;
}
async function getMynames(req) {
  const myNames = await User.findOne({
    attributes: ["id", "name"],
    where: { id: req.session.userId },
  });
  return myNames;
}
exports.courseReview_register = async (req, res) => {
  const courseReview = await registerCourseReviews(req);
  console.log("courseReview:", courseReview);
  const myName = await getMynames(req);
  console.log("myName", myName);
  let data = { courseReview, myName };
  res.send(data);
};
//* 로드
exports.courseReview_load = (req, res) => {
  CourseReview.findOne({
    where: { id: req.body.id },
  }).then((result) => {
    console.log("CourseReview_load", result);
    res.send(result);
  });
};
//* 수정
exports.courseReview_update = (req, res) => {
  const data = {
    comment: req.body.comment,
  };
  CourseReview.update(data, {
    where: { id: req.body.id },
  }).then((result) => {
    console.log("courseReview_update", result);
    res.send(result);
  });
};
//* 삭제
exports.courseReview_delete = (req, res) => {
  CourseReview.destroy({ where: { id: req.body.id } }).then(() => {
    res.send("기대평 삭제 성공!");
  });
};

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
