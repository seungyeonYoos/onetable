//controller/VisitorController.js
const { Visitor } = require("../model");
//../model/index.js를 넣는 것과 같다. export한 db에서 Visitor만 따로 빼서 변수에 담은 것.

exports.get_visitors = (req, res) => {
    //sql문: SELECT * FROM visitor;
    Visitor.findAll().then((result) => {
        console.log("result : ", result);
        console.log("index");
        res.render("index", { data: result });
    });
};
