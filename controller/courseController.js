const {
  Course,
  User,
  Application,
  ClassFavorite,
  ClassReview,
} = require("../model");

exports.main = (req, res) => {
  res.render("");
};

exports.course_register = (req, res) => {
  const data = {
    name: req.body.name,
    image: req.body.image,
    intro: req.body.intro,
    price: req.body.price,
    hour: req.body.hour,
    date: req.body.date,
    user_id: req.body.id,
    //? 여기서 id는 작성자(user_id) id를 나타냄. 질문하자
  };
  User.findOne({
    where: { email: "miso6495@gmail.com" },
  }).then((result) => {
    console.log("findOne:", result.id);
  });
  Course.create(data).then((result) => {
    console.log("create:", result);
    res.send(true);
  });
};
// postman에서 user_id에다가 값을 입력해서 넣어줘도
// "Field 'user_id' doesn't have a default value" 이렇게 뜨면서 오류가 남 이유가 뭐지요?

// exports.course_show = (req, res) => {
//   Course.findAll().then((result) => {
//     console.log("result:", result);
//     res.render("class", { courseData: result });
//   });
// };
