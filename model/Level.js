const Level = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "level",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      lv: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      // database 모델 정의 부분. mysql은 db 생성 시 적용함.
      tableName: "level",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = Level;
