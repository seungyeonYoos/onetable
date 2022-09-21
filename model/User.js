const User = (Sequelize, DataTypes) => {
    const model = Sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                // comment: "hahahah"
                // validate: 유효성 검사하는 속성
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            pw: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING(50),
            },
        },
        {
            // database 모델 정의 부분. mysql은 db 생성 시 적용함.
            tableName: "user",
            freezeTableName: true,
            timestamps: false,
        }
    );
    return model;
};

module.exports = User;
