const recipeController = require("../controller/recipeController");
const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/recipe");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            //ext 는 확장자를 담는 변수다.
            // req.session.id를 파일명에 추가하면 구별이 가능하겠다.
            done(
                null,
                "recipe" +
                    path.basename(file.originalname, ext) +
                    Date.now() +
                    ext
            );
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    //파일 크기 제한 5MB.
});

function is_login(req, res, next) {
    console.log(req.session);
    console.log(req.session.id, req.session.user);
    if (req.session.user) {
        console.log("YES LOGIN");
        next();
    } else {
        console.log("NO LOGIN");
        res.redirect("/user/login");
    }
}

router.get("/", recipeController.getAllRecipe);
router.post(
    "/register",
    is_login,
    upload.array("userfile"),
    recipeController.recipeRegister
);
router.get("/:id(\\d+)", recipeController.getRecipe);

module.exports = router;
