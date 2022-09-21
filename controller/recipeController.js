const {
  Recipe,
  User,
  Level,
  Category,
  Ingredient,
  Measurement,
  RecipeIngredient,
} = require("../model");

//임시 데이터
const data = {
  title: "내가 만든 쿠키",
  photo: "asldjf.jpg",
  intro: "소개글",
  lv: "초급",
  category: "구움과자",
  email: "ddd@gmail.com",
};

const data1 = {
  recipe_title: "내가 만든 쿠키",
  amount: 20,
  ingredient_unit: "고춧가루2",
  measurement_unit: "g",
};

const data2 = {};

exports.main = (req, res) => {
  res.render("recipe");
};

exports.recipeRegister = async (req, res) => {
  // const data = req.body;
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
  });

  if (selectCategory && selectLevel && selectUser) {
    //select가 다 성공하면 recipe insert하기
    console.log("success");
    const insertRecipe = await Recipe.create({
      title: data.title,
      photo: data.photo,
      intro: data.intro,
      level_id: selectLevel.id,
      category_id: selectCategory.id,
      user_id: selectUser.id,
    });
  } else {
    console.log("failed", selectCategory, selectLevel, selectUser);
    res.send("fail to find category & level & user");
  }

  let measurement = await Measurement.findOne({
    attributes: ["id"],
    where: { unit: data1.measurement_unit },
  });
  if (!measurement) {
    measurement = await Measurement.create({
      unit: data1.measurement_unit,
    });
  }

  let ingredient = await Ingredient.findOne({
    attributes: ["id"],
    where: { unit: data1.ingredient_unit },
  });
  if (!ingredient) {
    ingredient = await Ingredient.create({
      unit: data1.ingredient_unit,
    });
  }
  const selectRecipe = await Recipe.findOne({
    attributes: ["id"],
    where: { title: data.title },
  });
  // selectIngredient,id
  if (ingredient && measurement) {
    const insertRecipeIngredient = await RecipeIngredient.create({
      recipe_id: selectRecipe.id,
      amount: data1.amount,
      ingredient_id: ingredient.id,
      unit_id: unit.id,
    });
  } else {
    console.log("ingredient & measurment sql 찾기 또는 입력 오류가 있음.");
    res.send("fail to find ingredient & measurement");
  }

  res.render("recipe");
};
