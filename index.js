const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const globalRouter = require("./routes/globalRouter");
const userRouter = require("./routes/userRouter");

app.use("/", globalRouter);
app.use("/user", userRouter);

app.listen(port, () => {
    console.log("Server Port : ", port);
});
