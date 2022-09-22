const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cookie & session 관련
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // module 사용할 때 이렇게 연결 지어줘야 함

const session = require("express-session");
const FileStore = require("session-file-store")(session);
app.use(
  session({
    secret: "onetable", // 암호화할 때 사용할 문자열(cookie는 선택 session은 암호화 기본)
    resave: false, // 요청이 들어올 때마다 session에 저장을 할 건지 말 건지
    saveUninitialized: true, // session이 필요하기 전까지는 구동하지 않는다. resave랑 이거는 그냥 외우자
    store: new FileStore(),
    // secure: true,               // https 보안서버에서만 동작하겠다는 의미
    // cookie: {
    //   maxAge: 60000,
    //   httpOnly: true,
    // },
    // 원래 session은 브라우저를 끄면 사라진다고(여기서는 다시 id발급) 했는데
    // 이렇게 cookie를 설정해주면 60초 동안은 받은 id를 유지한다.
  })
);

const globalRouter = require("./routes/globalRouter");
const recipeRouter = require("./routes/recipeRouter");
const userRouter = require("./routes/userRouter");
const courseRouter = require("./routes/courseRouter");

app.use("/", globalRouter);
app.use("/recipe", recipeRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);

app.listen(port, () => {
  console.log("Server Port : ", port);
});
