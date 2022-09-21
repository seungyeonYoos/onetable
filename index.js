const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const globalRouter = require("./routes/globalRouter");
const recipeRouter = require("./routes/recipeRouter");
const userRouter = require("./routes/userRouter");

app.use("/", globalRouter);
app.use("/recipe", recipeRouter);
app.use("/user", userRouter);

app.listen(port, () => {
    console.log("Server Port : ", port);
});
