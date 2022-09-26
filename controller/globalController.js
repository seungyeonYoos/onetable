const { sequelize, Favorite, User, Recipe } = require("../model");

//좋아요 수가 높은 10개의 레시피들을 가져오는 함수.
async function getBestRecipes() {
	// raw 쿼리문:
	// const [results] = await Favorite.sequelize.query(
	// 	"select recipe.id, recipe.title, recipe.image, count(favorite.recipe_id) as favCount from favorite left join recipe on favorite.recipe_id = recipe.id group by favorite.recipe_id limit 10;"
	// );

	const bestRecipes = await Favorite.findAll({
		raw: true,
		attributes: [
			[sequelize.fn("COUNT", sequelize.col("recipe_id")), "favCount"],
		],
		group: ["recipe_id"],
		order: [["favCount", "DESC"]],
		include: [
			{
				model: Recipe,
				attributes: ["id", "title", "image"],
				required: false, //left join 그냥 하면 inner join이 됨.
			},
		],
		limit: 10,
	});

	return bestRecipes;
}

exports.main = async (req, res) => {
	const bestRecipe = await getBestRecipes();
	console.log("bestRecipe:", bestRecipe);

	res.render("index", { bestRecipe });
};
