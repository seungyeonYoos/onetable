const Course = (Sequelize, DataTypes) => {
  const model = Sequelize.define(
    "course",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(20),
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
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hour: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      // database 모델 정의 부분. mysql은 db 생성 시 적용함.
      tableName: "course",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = Course;
