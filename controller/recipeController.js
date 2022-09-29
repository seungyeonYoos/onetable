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
} = require("../model");

//프론트에서 전달 받아야되는 데이터. 예외) email은 추후 session을 통해 데이터 전달 받을 예정

/*프론트에서 url parameter 확인하는 방법:
input hidden으로 해서 전달가능해 보임... req.query로 id값을 볼 수 있다.
const urlParams = new URL(location.href).searchParams;
const recipe_id = urlParams.get('id');
console.log(recipe_id)

const data = {
  recipe_id: 1,
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
exports.getRecipe = async(req, res) => {
    const { id } = req.params;
    // 해당 타겟 레시피의 연관 정보를 검색.
    // join table 해서 하면 편할것 같은데... 좀더 알아보고 변경 진행할 예정
    const selectTargetRecipe = await Recipe.findOne({
        raw: true,
        attributes: { exclude: ["category_id", "level_id", "user_id"] },
        where: { id },
        include: [{
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

    const selectReviews = await Review.findAll({
        raw: true,
        where: { recipe_id: id },
        order: [
            ["id", "DESC"]
        ],
        //가장 최근 등록된 순서로 나온다.
    });


	// console.log("✅selectTargetRecipe:", selectTargetRecipe);
	// console.log("✅selectSteps:", selectSteps);
	// console.log("✅selectReview:", selectReviews);
	if (selectTargetRecipe) {
		res.render("recipein", {
			selectTargetRecipe,
			selectSteps,
			selectReviews,
			id,
		});
	} else {
		console.log("해당 레시피는 없습니다.");
		res.render("recipein", { data: "recipe id is not found" });
	}

};

// 특정 카테고리로 레시피들을 보여준다.
async function getTargetRecipes(target) {
    //category로 선택해서 볼때.
    if (target) {
        const { count, rows } = await Recipe.findAndCountAll({
            raw: true,
            attributes: { exclude: ["category_id", "level_id", "user_id"] },
            include: [{
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
        return { count, rows };
    } else {
        //선택값이 없을 때 전부 보여준다.
        const { count, rows } = await Recipe.findAndCountAll({
            raw: true,
            attributes: { exclude: ["category_id", "level_id", "user_id"] },
            include: [{
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

//(method: get) (path: /recipe)에서 레시피들을 보여준다.
exports.getAllRecipe = async(req, res) => {
    // let target = req.body.target;
    let target = req.query.category;
    console.log(req.query);
    console.log("target:", target);
    //const {target} = req.query;
    let data;
    if (target) {
        data = await getTargetRecipes(target);
    } else {
        data = await getTargetRecipes();
    }
    console.log(data);

    if (data.rows) {
        // console.log(typeof rows, typeof count);
        res.render("recipe", { data: data.rows, count: data.count });
    } else {
        console.log("레시피가 찾아지지 않았습니다.");
        res.render("recipe", { data: false });
    }
};

// (method: post) (path: /recipe/register) 레시피를 등록한다.
exports.recipeRegister = async(req, res) => {
    // const data = req.body; 프론트 전달 받을 데이터.
    // req.session.key (req.session.userID) 유저 정보를 가져올 방법.
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
        // const insertRecipe =
        await Recipe.create({
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
            // const insertRecipeIngredient =
            await RecipeIngredient.create({
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
        // const insertStep =
        await Step.create({
            recipe_id: selectRecipe.id,
            instruction: data.steps[i].instruction,
            image: data.steps[i].image,
            stepNumber: data.steps[i].stepNumber,
        });
    }
    res.render("recipe");
};

// (method: get) (path: /recipe/register) 레시피 등록 view 페이지 불러오기.
exports.getRecipeRegister = (req, res) => {
    res.render("recipeRegister");
};
//(method: post) (path: /recipe/:id) 리뷰 등록할 때 axios로 페이지 전환없이 등록 예정.
exports.postReview = async(req, res) => {
    const user_id = req.session.userId;
    const recipe_id = req.params.id;
    //req.body 에 담겨지는 데이터들 받아와서 score랑 comment 받아오기.
    // const { score, comment } = req.body.data;
    const score = 1;
    const comment = "ㄴㄴ";
    const review = await Review.create({
        user_id,
        recipe_id,
        score: score ? 0 : score,
        comment: comment ? "" : comment,
    });
    console.log("review 등록 확인하기:", review);
    res.render("recipein");
};

// (method: get) (path: /recipe/:id/modify) 레시피 수정하는 부분
exports.getModifyRecipe = async(req, res) => {
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
	res.render("recipeModify", { selectRecipe, selectIngredient, selectStep });

};
// (method: put) (path: /recipe/:id/modify) 레시피 수정한 것을 등록하는 부분
exports.modifyRecipe = async (req, res) => {
	//req.body.data
	const { id } = req.params;
	const user_id = req.session.userId;

	const changeColumn = {
		title: req.body.data.title,
		image: req.files[0],
		intro: req.body.data.intro,
		cookTime: req.body.data.cookTime,
	};

	const updateRecipe = await Recipe.update(changeColumn, {
		where: { id: 2 },
		//req.file << 파일 정보들을 콘솔로 확인 필요.
	});
};

// (method: delete) (path: /recipe/:id/modify) 레시피 삭제
exports.deleteRecipe = async (req, res) => {
	//req.body.data
	const { id } = req.params;
	// const user_id = req.session.userId;

	try {
		//1.recipeIngredient 삭제
		await RecipeIngredient.destroy({
			where: { recipe_id: id },
		});
		//2. step 삭제
		await Step.destroy({
			where: { recipe_id: id },
		});
		//3. recipe 삭제
		await Recipe.destroy({
			where: { id },
		});
	} catch (error) {
		console.error(error);
		return res.send(false);
	}

	res.redirect("/recipe");
};
