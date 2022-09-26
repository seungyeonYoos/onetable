const {
  Course,
  User,
  Application,
  ClassFavorite,
  ClassReview,
} = require("../model");

//* course main페이지
exports.main = (req, res) => {
  Course.findAll({}).then((result) => {
    console.log("findAll:", result);
    res.render("course", { courseData: result });
  });
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

//* 내가 올린 course(이건 마이페이지 같은데)
exports.course_show_myRegister = (req, res) => {
  Course.findAll({
    where: { user_id: req.query.userId },
    // 이부분도 req.session.userId 들어가면 됨.
  }).then((result) => {
    console.log("findAll:", result);
    res.render("class", { courseData: result });
  });
};

//* 내가 신청한 course(이것도 마이페이지)
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
