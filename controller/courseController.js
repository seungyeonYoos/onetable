const {
  Course,
  User,
  Application,
  ClassFavorite,
  ClassReview,
} = require("../model");

exports.main = (req, res) => {
  res.render("course");
};

//* 보여주는 부분
exports.course_show = (req, res) => {
  Course.findAll({}).then((result) => {
    console.log("findAll:", result);
    res.render("class", { courseData: result });
  });
};

//* 등록부분
exports.course_registerPage = (req, res) => {
  res.render("courseForm");
};
exports.course_register = (req, res) => {
  const data = {
    name: req.body.name,
    image: req.body.image,
    intro: req.body.intro,
    price: req.body.price,
    hour: req.body.hour,
    date: req.body.date,
    user_id: req.session.userId,
    //? 여기서 id는 작성자(user_id) id를 나타냄. 질문하자
  };
  // req.session.userId를 할거면 애초에 findOne 할 필요 없음
  // User.findOne({
  //   where: { email: "miso6495@gmail.com" },
  //   // 여기에 원래 user_id: req.session.userId 들어가져야 함
  // }).then((result) => {
  //   console.log("findOne:", result.id);
  // });
  Course.create(data).then((result) => {
    console.log("create:", result);
    res.send(true);
  });
};

//* 내가 올린 course
exports.course_show_myRegister = (req, res) => {
  Course.findAll({
    where: { user_id: req.query.userId },
    // 이부분도 req.session.userId 들어가면 됨.
  }).then((result) => {
    console.log("findAll:", result);
    res.render("class", { courseData: result });
  });
};

//* 신청
exports.course_apply = (req, res) => {
  const data1 = {
    user_id: req.body.userId,
    // req.session.userId
    course_id: req.body.courseId,
    // 왜 숫자 2를 넣는데 1이 들어가는 걸까...
  };
  Application.create(data1).then((result) => {
    console.log("create:", result);
  });
};

//* 내가 신청한 course
exports.course_show_myApply = (req, res) => {
  Application.findAll({
    attributes: ["course_id"],
    where: { user_id: req.query.userId },
    // req.session.userId
  }).then((result) => {
    console.log("findAll", result);
    console.log(result[0].course_id);
    Course.findAll({
      where: { id: result[0].course_id },
    }).then((result) => {
      console.log("course:", result);
    });
  });
  // console.log("담겼니", result1);
  // Course.findAll({
  //   where: { course_id: courseId[0].course_id },
  // }).then((result1) => {
  //   console.log("findAll1", result1);
  // });
  //? 내가 신청한 course를 찾는 과정.
  //? 일단 application에서 user_id를 통해 course_id를 찾은 다음에
  //? course에서 course_id를 통해서 찾아야 하는데 방법을 모르겠음
};

//* 메인페이지에 인기순으로 보여지는
