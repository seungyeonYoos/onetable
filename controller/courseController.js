const e = require("express");
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
exports.main = async (req, res) => {
  // query
  let query = "";
  // priceValue
  let priceValue;
  if (req.query.price == "low") priceValue = " < 50000 ";
  else if (req.query.price == "middle")
    priceValue = " BETWEEN 50000 AND 80000 ";
  else priceValue = " > 80000 ";

  if (req.query.order && req.query.month && req.query.price) {
    query = `SELECT 
                c.id,
                c.name,
                c.image,
                c.price,
                COUNT(*)
              FROM course AS c INNER JOIN ${req.query.order} AS a
              ON c.id = a.course_id
              WHERE c.date > CURDATE()
              AND MONTH(c.date) = '${req.query.month}'
              AND price ${priceValue}
              GROUP BY c.id, c.name, c.image, c.price
              ORDER BY COUNT(*) DESC;`;
  } else if (req.query.order && req.query.month) {
    query = `SELECT 
                c.id,
                c.name,
                c.image,
                c.price,
                COUNT(*)
              FROM course AS c INNER JOIN ${req.query.order} AS a
              ON c.id = a.course_id
              WHERE c.date > CURDATE()
              AND MONTH(date) = '${req.query.month}'
              GROUP BY c.id, c.name, c.image, c.price
              ORDER BY COUNT(*) DESC;`;
  } else if (req.query.order && req.query.price) {
    query = `SELECT 
                c.id,
                c.name,
                c.image,
                c.price,
                COUNT(*)
              FROM course AS c INNER JOIN ${req.query.order} AS a
              ON c.id = a.course_id
              WHERE c.date > CURDATE()
              AND price ${priceValue};
              GROUP BY c.id, c.name, c.image, c.price
              ORDER BY COUNT(*) DESC;`;
  } else if (req.query.month && req.query.price) {
    query = `SELECT * FROM course
              WHERE date > CURDATE()
              AND MONTH(date) = '${req.query.month}'
              AND price ${priceValue};`;
  } else if (req.query.order) {
    query = `SELECT
                c.id,
                c.name,
                c.image,
                COUNT(*)
              FROM course AS c INNER JOIN ${req.query.order} AS a
              ON c.id = a.course_id
              WHERE c.date > CURDATE()
              GROUP BY c.id, c.name, c.image
              ORDER BY COUNT(*) DESC;`;
  } else if (req.query.month) {
    query = `SELECT * FROM course
              WHERE date > CURDATE()
              AND MONTH(date) = '${req.query.month}'`;
  } else if (req.query.price) {
    query = `SELECT * FROM course
              WHERE date > CURDATE()
              AND price ${priceValue};`;
  } else {
    query = `SELECT * FROM course
              WHERE date > CURDATE()
              ORDER BY id DESC;`;
  }
  let result = await sequelize.query(query, { type: QueryTypes.SELECT });
  console.log("courseData:", result);
  res.render("course", { courseData: result });
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
    console.log("courseInfo:", courseApply);
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

exports.course_apply = async (req, res) => {
  try {
    const { imp_uid, merchant_uid } = req.body;

    // 액세스 토큰(access token) 발급 받기
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: "4234662338446257", // REST API 키
        imp_secret:
          "qe4WA34s1r8kjnFZeKVGm0BcSvXzrht7OQDcIiZ6rWExsFv9H78mMdHICHYwBX2jsVXF8VmDVe1goyDM", // REST API Secret
      },
    });
    const { access_token } = getToken.data.response; // 인증 토큰

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: "get", // GET method
      headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
    });
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보

    // DB에서 결제되어야 하는 금액 조회
    const order = await Orders.findById(paymentData.merchant_uid);
    const amountToBePaid = order.amount; // 결제 되어야 하는 금액

    // 결제 검증하기
    // 결제 검증하기
    const { amount, status } = paymentData;
    if (amount === amountToBePaid) {
      // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      await Orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장

      switch (status) {
        case "paid": // 결제 완료
          res.send({ status: "success", message: "일반 결제 성공" });
          break;
      }
    } else {
      // 결제금액 불일치. 위/변조 된 결제
      throw { status: "forgery", message: "위조된 결제시도" };
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

//* 상세페이지
exports.course_detailPage = (req, res) => {
  if (req.query.courseID) {
    Course.findOne({
      where: { id: req.query.courseID },
    }).then((result) => {
      console.log("course_detailPage:", result);
      res.render("coursein", { courseDetail: result });
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
