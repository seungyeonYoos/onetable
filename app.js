const express = require("express");
const app = express();


app.set("view engine", "ejs");

app.get("/recipe", function(req, res) {
    res.render("recipe");
});

app.listen(3000, function() {
    console.log("server open: ", 3000);
});