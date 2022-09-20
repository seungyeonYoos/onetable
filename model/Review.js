const Review = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT("medium"),
      },
    },
    {
      // database 모델 정의 부분. mysql은 db 생성 시 적용함.
      tableName: "review",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = Review;
