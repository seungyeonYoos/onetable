const { sequelize, Favorite, User, Recipe } = require("../model");

exports.main = async (req, res) => {
	//group(sql문 절) + count(함수) + join
	//SELECT a.id, COUNT(b.id) FROM TABLE_A a LEFT JOIN TABLE_B b ON a.id = b.id WHERE 1 GROUP BY a.id ORDER BY COUNT(b.id)
	// const { count, rows } = await Favorite.findAndCountAll({
	//     where,
	// });
	const bestRecipes = await Favorite.findAll({
		raw: true,
		attributes: [
			"id",
			[
				sequelize.fn("COUNT", sequelize.col("recipe_id")),
				"count_recipe_id",
			],
		],
		group: ["recipe_id"],
		// [sequelize.fn('max', sequelize.col('age')), 'DESC'],sequelize.literal('max(age) DESC'),sequelize.literal('favorite.recipe_id DESC')
		order: sequelize.literal("favorite.recipe_id DESC"),
		include: [
			{
				model: Recipe,
				attributes: ["id", "image"],
			},
		],
		// limit: 20,
	});

	console.log(bestRecipes);
	res.render("index");
};
