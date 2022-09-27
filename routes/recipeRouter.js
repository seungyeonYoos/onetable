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
			done(
				null,
				path.basename(file.originalname, ext) +
					Date.now() +
					req.session.userId +
					ext
			);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
	//파일 크기 제한 5MB.
});

function is_login(req, res, next) {
	if (res.locals.isLogin) {
		console.log("YES LOGIN");
		next();
	} else {
		console.log("NO LOGIN");
		res.redirect("/user/login");
	}
}

//전체 레시피 보는 부분 (path: /recipe)
router.get("/", recipeController.getAllRecipe);

//레시피 등록하는 부분 (path: /recipe/register), (method: get & post)
router.get("/register", is_login, recipeController.getRecipeRegister);
router.post(
	"/register",
	is_login,
	upload.array("userfile"),
	recipeController.recipeRegister
);

//등록된 1개의 특정 레시피를 보는 부분 (path: /recipe/'레시피 id')
router.get("/:id(\\d+)", recipeController.getRecipe);

module.exports = router;
