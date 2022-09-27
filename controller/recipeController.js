const {
	Recipe,
	User,
	Level,
	Category,
	Ingredient,
	Unit,
	RecipeIngredient,
	Step,
} = require("../model");

//프론트에서 전달 받아야되는 데이터. 예외) email은 추후 session을 통해 데이터 전달 받을 예정

/*const data = {
	title: "내가 만든 쿠키",
	image: "asldjf.jpg",
	//image는 axios form 전송으로 진행되어 req.files에 담겨짐.
	intro: "소개글",
	lv: "초급",
	category: "구움과자",
	email: "ddd@gmail.com",
	//session에서 로그인 정보를 가져와서 해야한다.
	amount: 20,
	ingredient: [
		{
			ingredient_list: "고춧가루1",
			unit_list: "g",
		},
		{
			ingredient_list: "고춧가루2",
			unit_list: "g",
		},
	],
	steps: [
		{
			instruction: "첫번째로 고춧가루를 용기에 담아줍니다.",
			image: "pour.jpg",
			stepNumber: 1,
		},
		{
			instruction: "그다음 식초와 물을 부어서 30분간 냉장보관합니다.",
			image: "pour2.jpg",
			stepNumber: 2,
		},
	],

};
*/

//특정 아이디의 레시피를 보여준다.
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
	// console.log("✅selectTargetRecipe:", selectTargetRecipe);
	// console.log("✅selectSteps:", selectSteps);
	if (selectTargetRecipe) {
		res.render("recipein", { selectTargetRecipe, selectSteps });
	} else {
		res.send("recipe id is not found");
	}
};

// (path: /recipe)에서 레시피들을 보내준다.
// 좋아요 오름차순, 내림차순 설정

async function get(target, order) {
	const { count, rows } = await Recipe.findAndCountAll({
		raw: true,
		attributes: { exclude: ["category_id", "level_id", "user_id"] },
		order: [[`${target}`, `${order}`]],
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
	return { count, rows };
}

async function getTargetRecipes(target, list) {
	//category로 선택해서 볼때.
	if (target === "category") {
		const { count, rows } = await Recipe.findAndCountAll({
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
					where: { list },
				},
				{
					model: Category,
					attributes: { exclude: ["id"] },
				},
			],
		});
		return { count, rows };
	} else if (target === "level") {
		// level로 선택해서 볼때
		const { count, rows } = await Recipe.findAndCountAll({
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
					where: { list },
				},
			],
		});
		return { count, rows };
	} else {
		//선택값이 없을 때 전부 보여준다.
		const { count, rows } = await Recipe.findAndCountAll({
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
		return { count, rows };
	}
}

exports.getAllRecipe = (req, res) => {
	// let target = req.body.target;
	let target, list;
	//const {target, list} = req.query;
	let data;
	if (target && list) {
		data = getTargetRecipes(target, list);
	} else {
		data = getTargetRecipes();
	}

	if (data.rows) {
		// console.log(typeof rows, typeof count);
		res.render("recipe", { data: data.rows, count: data.count });
	} else {
		console.log("레시피가 찾아지지 않았습니다.");
		res.send(false);
	}
};

exports.recipeRegister = async (req, res) => {
	// const data = req.body; 프론트 전달 받을 데이터.
	// req.session.key (req.session.user) 유저 정보를 가져올 방법.
	// req.files에 이미지 담긴다. 추후 이미지 경로를 db에 저장하는 것으로 변경 필요.

	//Recipe 생성 부분
	const selectCategory = await Category.findOne({
		attributes: ["id"],
		where: { list: data.category },
	});
	const selectLevel = await Level.findOne({
		attirbutes: ["id"],
		where: { list: data.lv },
	});
	const selectUser = await User.findOne({
		attirbutes: ["id", "email", "name"],
		where: { email: data.email },
		//req.session.user.email? 이런식으로 받아올 것.
	});

	if (selectCategory && selectLevel && selectUser) {
		//select가 다 성공하면 recipe insert하기
		const insertRecipe = await Recipe.create({
			title: data.title,
			image: data.image,
			intro: data.intro,
			level_id: selectLevel.id,
			category_id: selectCategory.id,
			user_id: selectUser.id,
		});
		// console.log("insertRecipe: ", insertRecipe);
	} else {
		console.log("failed", selectCategory, selectLevel, selectUser);
		res.send("fail to find category & level & user");
	}

	let ingredient, unit;

	for (let i = 0; i < data.ingredient.length; i++) {
		ingredient = await Ingredient.findOne({
			attributes: ["id"],
			where: { list: data.ingredient[i].ingredient_list },
		});
		if (!ingredient) {
			ingredient = await Ingredient.create({
				list: data.ingredient[i].ingredient_list,
			});
		}
		unit = await Unit.findOne({
			attributes: ["id"],
			where: { list: data.ingredient[i].unit_list },
		});
		if (!unit) {
			unit = await Unit.create({
				list: data.ingredient[i].unit_list,
			});
		}
		if (ingredient && unit && selectRecipe) {
			const insertRecipeIngredient = await RecipeIngredient.create({
				recipe_id: insertRecipe.id, // insertRecipe의 아이디를 받아온다.
				amount: data.amount,
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
	for (let i = 0; i < data.steps.length; i++) {
		const insertStep = await Step.create({
			recipe_id: selectRecipe.id,
			instruction: data.steps[i].instruction,
			image: data.steps[i].image,
			stepNumber: data.steps[i].stepNumber,
		});
	}
	res.render("recipe");
};

exports.getRecipeRegister = (req, res) => {
	res.render("recipeRegister");
};
