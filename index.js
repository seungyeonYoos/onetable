const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const globalRouter = require("./routes/globalRouter");
const recipeRouter = require("./routes/recipeRouter");
const userRouter = require("./routes/userRouter");

app.use("/", globalRouter);
app.use("/recipe", recipeRouter);
app.use("/user", userRouter);


app.get("/recipe", function(req, res) {
    res.render("recipe");
});
app.get("/login", function(req, res) {
    res.render("login");
});
app.get("/signup", function(req, res) {
    res.render("signup");
});


app.listen(port, () => {
    console.log("Server Port : ", port);
});