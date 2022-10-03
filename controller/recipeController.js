const {
	Recipe,
	User,
	Level,
	Category,
	Ingredient,
	Unit,
	RecipeIngredient,
	Step,
	Review,
	Favorite,
	sequelize,
} = require("../model");

//(method: get) (path: /recipe/:id) 특정 아이디의 레시피를 보여준다.
exports.getRecipe = async (req, res) => {
	const { id } = req.params;
	// 해당 타겟 레시피의 연관 정보를 검색.
	// join table 해서 하면 편할것 같은데... 좀더 알아보고 변경 진행할 예정
	const selectTargetRecipe = await Recipe.findOne({
		raw: true,
		attributes: { exclude: ["category_id", "level_id", "user_id"] },
		where: { id },
		include: [
			{
				model: User,
				attributes: { exclude: ["pw", "id"] },
			},
			{
				model: Level,
				attributes: { exclude: ["id"] },
			},
			{
				model: Category,
				attributes: { exclude: ["id"] },
			},
		],
	});

	// 해당 레시피의 요리 단계(step)을 검색.
	const selectSteps = await Step.findAll({
		raw: true,
		where: { recipe_id: id },
	});
	console.log("🚀🚀🚀🚀🚀", selectSteps);
	const selectReviews = await Review.findAll({
		raw: true,
		where: { recipe_id: id },
		order: [["id", "DESC"]],
		include: [
			{
				model: User,
				attributes: ["name"],
				required: false,
			},
		],
		//가장 최근 등록된 순서로 나온다.
	});

	// console.log("✅selectTargetRecipe:", selectTargetRecipe);
	// console.log("✅selectSteps:", selectSteps);
	// console.log("✅selectReviews:", selectReviews);

	//selectFavorite: 로그인한 유저가 해당 레시피를 좋아요 유무 확인.
	let selectFavorite;
	if (req.session.userId) {
		selectFavorite = await Favorite.findOne({
			raw: true,
			where: { user_id: req.session.userId, recipe_id: id },
		});
	}
	// console.log("✅selectFavorite:", selectFavorite);
	if (selectTargetRecipe) {
		res.render("recipein", {
			selectTargetRecipe,
			selectSteps,
			selectReviews,
			selectFavorite: selectFavorite ? true : false,
			id,
			popup: req.cookies.popup,
		});
	} else {
		console.log("해당 레시피는 없습니다.");
		res.render("recipein", {
			data: "recipe id is not found",
			popup: req.cookies.popup,
		});
	}
};

// 특정 카테고리와 좋아요 정렬로 레시피들을 보여준다.
async function getTargetRecipes(target) {
	if (target === "1") {
		const rowChange = [];
		const result = await Favorite.findAll({
			raw: true,
			attributes: [
				[sequelize.fn("COUNT", sequelize.col("recipe_id")), "favCount"],
			],
			group: ["recipe_id"],
			order: [["favCount", "DESC"]],
			include: [
				{
					model: Recipe,
					attributes: ["id", "title", "image", "intro", "cookTime"],
					required: false, //left join 그냥 하면 inner join이 됨.
					include: [
						{
							model: User,
							attributes: { exclude: ["pw", "id"] },
							required: false,
						},
						{
							model: Level,
							attributes: { exclude: ["id"] },
							required: false,
						},
						{
							model: Category,
							attributes: ["list"],
							required: false,
						},
					],
				},
			],
			limit: 20,
		});
		for (const element of result) {
			const obj = new Object();
			for (const keys in element) {
				let key = keys === "favCount" ? keys : keys.slice(7);
				obj[key] = element[keys];
			}
			rowChange.push(obj);
		}

		return rowChange;
	} else if (target) {
		const result = await Recipe.findAll({
			raw: true,
			attributes: { exclude: ["category_id", "level_id", "user_id"] },
			include: [
				{
					model: User,
					attributes: { exclude: ["pw", "id"] },
				},
				{
					model: Level,
					attributes: { exclude: ["id"] },
				},
				{
					model: Category,
					attributes: { exclude: ["id"] },
					where: { list: target },
				},
			],
		});

		return result;
	} else {
		//선택값이 없을 때 전부 보여준다.
		const result = await Recipe.findAll({
			raw: true,
			attributes: { exclude: ["category_id", "level_id", "user_id"] },
			include: [
				{
					model: User,
					attributes: { exclude: ["pw", "id"] },
				},
				{
					model: Level,
					attributes: { exclude: ["id"] },
				},
				{
					model: Category,
					attributes: { exclude: ["id"] },
				},
			],
		});

		return result;
	}
}

//(method: get) (path: /recipe)에서 레시피들을 보여준다.
exports.getAllRecipe = async (req, res) => {
	// let target = req.body.data;
	const { category, like } = req.query;
	let data;

	if (!category && !like) {
		data = await getTargetRecipes();
		console.log("1");
	} else if (like) {
		data = await getTargetRecipes(like);
		console.log("2");
	} else {
		data = await getTargetRecipes(category);
		console.log("3");
	}
	// console.log("this is 데이터", data);

	if (data) {
		// console.log(typeof rows, typeof count);
		return res.render("recipe", { data, popup: req.cookies.popup });
	} else {
		console.log("레시피가 찾아지지 않았습니다.");
		return res.render("recipe", { data: false, popup: req.cookies.popup });
	}
};

// (method: post) (path: /recipe/register) 레시피를 등록한다.

exports.recipeRegister = async (req, res) => {
	const data = JSON.parse(req.body.data); // 프론트에서 전달 받는 데이터.
	// req.session.key (req.session.userID) 유저 정보를 가져올 방법.
	// req.files['recipe'][0] -> File
	// req.files['steps'] -> Array

	console.log(data);
	console.log(req.files);
	const selectCategory = await Category.findOne({
		attributes: ["id"],
		where: { list: data.category_list },
	});
	const selectLevel = await Level.findOne({
		attirbutes: ["id"],
		where: { list: data.level_list },
	});
	const selectUser = await User.findOne({
		attirbutes: ["id", "email", "name"],
		where: { id: req.session.userId },
	});
	// console.log("확인", selectUser);
	let recipe_id;
	let insertRecipe;
	if (selectCategory && selectLevel && selectUser) {
		//select가 다 성공하면 recipe insert하기
		insertRecipe = await Recipe.create({
			title: data.recipe_title,
			image: req.files["recipe"][0].filename,
			intro: data.recipe_intro,
			level_id: selectLevel.id,
			category_id: selectCategory.id,
			user_id: selectUser.id,
			cookTime: data.cookTime,
		});
		console.log("insertRecipe: ", insertRecipe.id);
		recipe_id = insertRecipe.id;
	} else {
		console.log("failed", selectCategory, selectLevel, selectUser);
		return res.send("fail to find category & level & user");
	}

	let ingredient, unit;

	for (let i = 0; i < data.ingredient.length; i++) {
		ingredient = await Ingredient.findOne({
			attributes: ["id"],
			where: { list: data.ingredient[i].ingredient },
		});
		if (!ingredient) {
			ingredient = await Ingredient.create({
				list: data.ingredient[i].ingredient,
			});
		}
		unit = await Unit.findOne({
			attributes: ["id"],
			where: { list: data.ingredient[i].unit },
		});
		if (!unit) {
			unit = await Unit.create({
				list: data.ingredient[i].unit,
			});
		}
		if (ingredient && unit) {
			// const insertRecipeIngredient =
			await RecipeIngredient.create({
				recipe_id, // insertRecipe의 아이디를 recipe_id에 담은 것을 등록한다.
				amount: data.ingredient[i].amount,
				ingredient_id: ingredient.id,
				unit_id: unit.id,
			});
		} else {
			console.log(
				"ingredient & measurment & selectRecipe sql 찾기 또는 입력 오류가 있음."
			);
			res.send("fail to find ingredient & unit & selectRecipe");
			break;
		}
	}
	//Step insert part for문으로 입력된 insert
	//Step 생성 부분
	// console.log("🚀🚀🚀🚀🚀", req.files["steps"]);
	for (let i = 0; i < data.steps.length; i++) {
		// const insertStep =
		await Step.create({
			recipe_id,
			instruction: data.steps[i],
			image: req.files["steps"][i].filename, //data.steps[i].image,
			stepNumber: i + 1,
		});
	}
	res.send("recipe 등록 완료");
};

// (method: get) (path: /recipe/register) 레시피 등록 view 페이지 불러오기.
exports.getRecipeRegister = (req, res) => {
	res.render("recipeRegister", { popup: req.cookies.popup });
};

//(method: post) (path: /recipe/:id) 리뷰 등록할 때 axios로 페이지 전환없이 등록 예정.
exports.postReview = async (req, res) => {
	const user_id = req.session.userId;
	const recipe_id = req.params.id;
	//req.body 에 담겨지는 데이터들 받아와서 score랑 comment 받아오기.
	const { score, comment } = req.body;
	// console.log(req.body.score);
	const review = await Review.create({
		user_id,
		recipe_id,
		score: score ? score : 0,
		comment: comment ? comment : "",
	});
	console.log("review 등록 확인하기:", review);
	console.log("score", score);
	console.log("commet", comment);
	res.send("리뷰 등록 완료");
};

// (method: get) (path: /recipe/:id/modify) 레시피 수정하는 페이지 불러옴.

exports.getModifyRecipe = async (req, res) => {
	//0. findone 으로 접속한 유저가 작성한 글이 맞는지 체크하기.
	const id = parseInt(req.params.id);
	const user_id = req.session.userId;

	const checkUser = await Recipe.findOne({
		raw: true,
		attributes: ["id", "user_id"],
		where: { id },
	});
	if (!(checkUser.id === id && checkUser.user_id === user_id)) {
		return res.send(false);
		// return res.redirect(`/recipe/${id}`, {
		// 	data: "접속한 유저가 등록한 글이 아닙니다.",
		// });
	}
	//1.recipe & level & category join table.
	const selectRecipe = await Recipe.findOne({
		raw: true,
		attributes: { exclude: ["category_id", "user_id", "level_id"] },
		where: { id },
		include: [
			{
				model: Level,
				attributes: ["list"],
				required: false, //left join 그냥 하면 inner join이 됨.
			},
			{
				model: Category,
				attributes: ["list"],
				required: false, //left join 그냥 하면 inner join이 됨.
			},
		],
	});
	//2.recipe_ingredient & ingredient & measurement join table
	const selectIngredient = await RecipeIngredient.findAll({
		raw: true,
		attributes: { exclude: ["recipe_id", "ingredient_id", "unit_id"] },
		where: { recipe_id: id },
		order: [["id", "ASC"]],
		include: [
			{
				model: Ingredient,
				attributes: ["list"],
				required: false,
			},
			{
				model: Unit,
				attributes: ["list"],
				required: false,
			},
		],
	});
	//3 step findall
	const selectStep = await Step.findAll({
		raw: true,
		where: { recipe_id: id },
		order: [["stepNumber", "ASC"]],
	});
	// console.log(
	// 	"selectRecipe",
	// 	selectRecipe,
	// 	"selectIngredient",
	// 	selectIngredient,
	// 	"selectStep",
	// 	selectStep
	// );
	res.render("recipeModify", {
		selectRecipe,
		selectIngredient,
		selectStep,
		popup: req.cookies.popup,
	});
};
// (method: put) (path: /recipe/:id/modify) 레시피 수정
exports.modifyRecipe = async (req, res) => {
	// req.files['recipe'][0] -> File
	// req.files['steps'] -> Array
	const data = JSON.parse(req.body.data);
	const { id } = req.params;
	const user_id = req.session.userId;

	const changeColumn = {
		title: data.recipe_title,
		image: req.files["recipe"][0],
		intro: data.recipe_intro,
		cookTime: data.cookTime,
	};

	//1. 레시피 수정 부분.
	const updateRecipe = await Recipe.update(changeColumn, {
		where: { id },
	});
	console.log(updateRecipe);

	//2. ingredientRecipe 수정 부분✅✅✅✅✅✅ 확인 필요하다.
	// for (let i = 0; i < data.ingredient.length; i++) {
	// 	ingredient = await Ingredient.findOne({
	// 		attributes: ["id"],
	// 		where: { list: data.ingredient[i].ingredient },
	// 	});
	// 	if (!ingredient) {
	// 		ingredient = await Ingredient.create({
	// 			list: data.ingredient[i].ingredient,
	// 		});
	// 	}
	// 	unit = await Unit.findOne({
	// 		attributes: ["id"],
	// 		where: { list: data.ingredient[i].unit },
	// 	});
	// 	if (!unit) {
	// 		unit = await Unit.create({
	// 			list: data.ingredient[i].unit,
	// 		});
	// 	}
	// 	if (ingredient && unit && selectRecipe) {
	// 		// const insertRecipeIngredient =
	// 		await RecipeIngredient.create({
	// 			recipe_id, // insertRecipe의 아이디를 recipe_id에 담은 것을 등록한다.
	// 			amount: data.amount,
	// 			ingredient_id: ingredient.id,
	// 			unit_id: unit.id,
	// 		});
	// 	} else {
	// 		console.log(
	// 			"ingredient & measurment & selectRecipe sql 찾기 또는 입력 오류가 있음."
	// 		);
	// 		res.send("fail to find ingredient & unit & selectRecipe");
	// 		break;
	// 	}
	// }

	//3. step 업데이트
	for (let i = 0; i < data.steps.length; i++) {
		// const insertStep =
		await Step.update(
			{
				instruction: data.steps[i],
				image: req.files["steps"][i], //data.steps[i].image,
				stepNumber: i + 1,
			},
			{ where: { recipe_id: id } }
		);
	}
};

// (method: delete) (path: /recipe/:id/modify) 레시피 삭제
exports.deleteRecipe = async (req, res) => {
	//req.body.data
	const { id } = req.params;
	// const user_id = req.session.userId;

	try {
		// //1.recipeIngredient 삭제
		// await RecipeIngredient.destroy({
		// 	where: { recipe_id: id },
		// });
		// //2. step 삭제
		// await Step.destroy({
		// 	where: { recipe_id: id },
		// });
		//3. recipe 삭제 -> recipe만 삭제되면 나머지 스텝이랑 recipeIngredient도 삭제가 될텐데, 실제로 그런지 확인 필요.
		await Recipe.destroy({
			where: { id },
		});
	} catch (error) {
		console.error(error);
		return res.send(false);
	}

	res.redirect("/recipe");
};

// (method: post) (path: /recipe/:id/fav) 좋아요 등록
exports.postFav = async (req, res) => {
	console.log(req.body);
	const createFavorite = await Favorite.create({
		user_id: req.session.userId,
		recipe_id: req.params.id,
	});
	console.log(createFavorite);
	res.send("좋아요 등록 완료");
};
// (method: delete) (path: /recipe/:id/fav) 좋아요 취소
exports.deleteFav = async (req, res) => {
	console.log(req.body);
	const deleteFavorite = await Favorite.destroy({
		where: {
			user_id: req.session.userId,
			recipe_id: req.params.id,
		},
	});
	console.log(deleteFavorite);
	res.send("좋아요 삭제 완료");
};
