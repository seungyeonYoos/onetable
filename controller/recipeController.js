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
const data = {
    title: "내가 만든 쿠키",
    image: "asldjf.jpg",
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

exports.getRecipe = (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    res.send(true);
};
exports.getAllRecipe = async (req, res) => {
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

    if (rows) {
        // res.render("recipe");
        console.log(rows, count);
        res.send(rows);
    } else {
        console.log("레시피 찾아지지 않았습니다.");
        res.send(false);
    }
};

exports.recipeRegister = async (req, res) => {
    // const data = req.body; 프론트 전달 받을 데이터.
    // req.session.key (req.session.user) 유저 정보를 가져올 방법.

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
        console.log("success");
        const insertRecipe = await Recipe.create({
            title: data.title,
            image: data.image,
            intro: data.intro,
            level_id: selectLevel.id,
            category_id: selectCategory.id,
            user_id: selectUser.id,
        });
        console.log("insertRecipe: ", insertRecipe);
        //💖💖💖💖💖💖 여기서 insertRecipe 확인하고, 해당 내용의 id를 가져올 수 있다면, 아래 selectRecipe부분을 문제없이 처리할 수 있다.
    } else {
        console.log("failed", selectCategory, selectLevel, selectUser);
        res.send("fail to find category & level & user");
    }

    //RecipeIngredient 생성부분
    const selectRecipe = await Recipe.findOne({
        attributes: ["id"],
        where: {
            // user_id: selectUser.id,
            title: data.title,
        },
    });

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
                recipe_id: selectRecipe.id,
                amount: data.amount,
                ingredient_id: ingredient.id,
                unit_id: unit.id,
            });
            console.log();
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
