const CourseReview = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "coursereview",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      comment: {
        type: DataTypes.TEXT("medium"),
      },
    },
    {
      // database 모델 정의 부분. mysql은 db 생성 시 적용함.
      tableName: "coursereview",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = CourseReview;
