const { sequelize, Favorite, User, Recipe } = require("../model");

exports.main = async (req, res) => {
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
		// sequelize.literal("favorite.recipe_id DESC"),
		include: [
			{
				model: Recipe,
				attributes: ["id", "title", "image"],
				required: false, //left join
			},
		],
		limit: 10,
	});

	console.log(bestRecipes);

	res.render("index", { bestRecipes });
};
