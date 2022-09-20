const Bookmark = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "bookmark",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      // database 모델 정의 부분. mysql은 db 생성 시 적용함.
      tableName: "bookmark",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = Bookmark;
