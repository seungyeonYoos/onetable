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
				//file.fieldname === 'recipe' ? file.fieldname +'-'+ req.params + ext : file.fieldname +  + ext
				// stepImage ? 'Date.now()' + '-' + 'userId' + '-' + 'recipe_id' +'-'+ 'stepNumber' + ext : Date.now() + '-' + 'userId' + '-' + 'recipe_id' + ext
				path.basename(file.originalname, ext) +
					Date.now() +
					req.session.userId +
					//setpNumber를 추가하자.req.body.data.stepNumber
					//2가지로 나눠서 생각해야한다. 레시피에 대한 사진인지, 레시피의 step 요리 단계 사진인지.
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
router.post("/:id(\\d+)", recipeController.postReview);

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
