const express = require("express");
const recipeController = require("../controller/recipeController");
const router = express.Router();
const multer = require("multer");

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

router.get("/", recipeController.main);
router.get(
    "/register",
    upload.single("userfile"),
    recipeController.recipeRegister
);

module.exports = router;
