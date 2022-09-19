const { User } = require("../model");
const { UserLikes } = require("../model");
const { UserWishList } = require("../model");

exports.get_visitors = (req, res) => {
    //sql문: SELECT * FROM visitor;
    Visitor.findAll().then((result) => {
        console.log("result : ", result);
        console.log("index");
        res.render("index", { data: result });
    });
};

exports.main = (req, res) => {
    res.render("");
};
