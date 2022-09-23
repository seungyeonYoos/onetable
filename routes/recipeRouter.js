const express = require("express");
const recipeController = require("../controller/recipeController");
const router = express.Router();
const multer = require("multer");
const { application } = require("express");

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

function is_login(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

router.get("/", recipeController.getAllRecipe);
router.post(
    "/register",
    // is_login,
    upload.single("userfile"),
    recipeController.recipeRegister
);
router.get("/:id(\\d+)", recipeController.getRecipe);

module.exports = router;
