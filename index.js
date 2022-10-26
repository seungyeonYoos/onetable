const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie & session 관련
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // module 사용할 때 이렇게 연결 지어줘야 함

const session = require("express-session");
// const FileStore = require("session-file-store")(session);
app.use(
  session({
    secret: "onetable", // 암호화할 때 사용할 문자열(cookie는 선택 session은 암호화 기본)
    resave: false, // 요청이 들어올 때마다 session에 저장을 할 건지 말 건지
    saveUninitialized: true, // session이 필요하기 전까지는 구동하지 않는다. resave랑 이거는 그냥 외우자
    // secure: true, // https 보안서버에서만 동작하겠다는 의미
    // cookie: {
    //   maxAge: 60000,
    //   //   httpOnly: true,
    // },
    // 이렇게 cookie를 설정해주면 60초 동안은 받은 id를 유지한다.
  })
);

// cookie
app.post("/cookie", (req, res) => {
  res.cookie("popup", "oneMinute", {
    maxAge: 30000,
    httpOnly: false,
  });
  res.send("쿠키 생성");
});

const globalRouter = require("./routes/globalRouter");
const recipeRouter = require("./routes/recipeRouter");
const userRouter = require("./routes/userRouter");
const courseRouter = require("./routes/courseRouter");
const searchRouter = require("./routes/searchRouter");

// 미들웨어로 로그인 유지
// isLogin이라는 변수에 true를 보내는 것
app.use("/*", function (req, res, next) {
  if (req.session.userId) {
    res.locals.isLogin = true;
    // console.log("true");
  } else {
    res.locals.isLogin = false;
    // console.log("false");
  }
  next();
});

// 그냥 노가다하자
// app.use("/*", function (req, res, next) {
//   req.cookies.popup = "";
// });

app.use("/", globalRouter);
app.use("/recipe", recipeRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/search", searchRouter);

app.listen(port, () => {
  console.log("Server Port : ", port);
});
