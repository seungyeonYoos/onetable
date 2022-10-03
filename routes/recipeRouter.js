const recipeController = require("../controller/recipeController");
const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

//steps로 등록되는 파일 수 카운트하는 변수
let count = 0;

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, "uploads/recipe");
		},
		filename(req, file, done) {
			if (file.fieldname === "steps") {
				count += 1;
			} else if (file.fieldname === "recipe") {
				count = 0;
			}
			const ext = path.extname(file.originalname);
			//ext 는 확장자를 담는 변수다.
			// const data = JSON.parse(req.body.data);
			// console.log(data);
			// console.log(data.recipe_title);
			done(
				null,
				//recipe에 담기는 파일이면 'recipe-1-1-now.jpg', 아니면 'steps-1-1-1-now.jpg'로 저장됨.
				file.fieldname === "recipe"
					? file.fieldname +
							"-" +
							req.session.userId +
							"-" +
							"1" +
							"-" +
							Date.now() +
							ext
					: file.fieldname +
							"-" +
							req.session.userId +
							"-recipe steps-" +
							// req.params.id + 등록할 때는 params에는 안담겨서 undefined 뜬다.
							// "-" +
							count +
							"-" +
							Date.now() +
							ext
			);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
	//파일 크기 제한 5MB.
});

function is_login(req, res, next) {
	if (res.locals.isLogin) {
		// console.log("YES LOGIN");
		next();
	} else {
		// console.log("NO LOGIN");
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
	upload.fields([
		{ name: "recipe", maxCount: 1 },
		{ name: "steps", maxCount: 10 },
	]), //maxcount는 최대 파일 수.
	recipeController.recipeRegister
);

//등록된 1개의 특정 레시피를 보는 부분 (path: /recipe/'레시피 id')
router.get("/:id(\\d+)", recipeController.getRecipe);
router.post("/:id(\\d+)", recipeController.postReview);

//해당 레시피 좋아요와 취소
router.post("/:id(\\d+)/fav", is_login, recipeController.postFav);
router.delete("/:id(\\d+)/fav", is_login, recipeController.deleteFav);

// 등록된 레시피를 작성자가 수정을 하는 부분
router.get("/:id(\\d+)/modify", recipeController.getModifyRecipe);
router.put(
	"/:id(\\d+)/modify",
	is_login,
	upload.fields([
		{ name: "recipe", maxCount: 1 },
		{ name: "steps", maxCount: 10 },
	]), //maxcount는 최대 파일 수.
	recipeController.modifyRecipe
);
router.delete("/:id(\\d+)/modify", is_login, recipeController.deleteRecipe);

module.exports = router;
