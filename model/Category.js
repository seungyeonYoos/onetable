const Category = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      cg: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      // database 모델 정의 부분. mysql은 db 생성 시 적용함.
      tableName: "category",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = Category;
