const Recipe = (Sequelize, DataTypes) => {
	const model = Sequelize.define(
		"recipe",
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			title: {
				type: DataTypes.STRING(30),
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			intro: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			cookTime: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			// database 모델 정의 부분. mysql은 db 생성 시 적용함.
			tableName: "recipe",
			freezeTableName: true,
			timestamps: false,
		}
	);
	return model;
};

module.exports = Recipe;
