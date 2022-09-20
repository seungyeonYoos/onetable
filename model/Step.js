const Step = (Sequelize, DataTypes) => {
    const model = Sequelize.define(
        "step", //테이블명
        {
            //테이블 정의 field를 적어둔다.
            id: {
                // sql문: id int not null primary key
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                // comment: "hahahah"
                // validate: 유효성 검사하는 속성
            },
            recipe_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            instruction: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING(50),
            },
            stepNumber: {
                type: DataTypes.INTEGER,
            },
        },
        {
            // database 모델 정의 부분. mysql은 db 생성 시 적용함.
            tableName: "step",
            freezeTableName: true,
            timestamps: false,
        }
    );
    return model;
};

module.exports = Step;
