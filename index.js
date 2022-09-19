const express = require("express");
const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// <예시용>
const routerVisitor = require("./routes/visitor");
app.use("/visitor", routerVisitor);

app.listen(port, () => {
  console.log("Server Port : ", port);
});
