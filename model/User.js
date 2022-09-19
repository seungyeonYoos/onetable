//model/Visitor.js
const Visitor = (Sequelize, DataTypes) => {
    //Sequelize: model/index.js의 sequelize 객체
    //DataTypes: model/index.js의 Sequelize 객체
    const model = Sequelize.define(
        "visitor", //테이블명
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
            name: {
                // sql문: name varchar(10) not null
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            comment: {
                // sql문: comment mediumtext
                type: DataTypes.TEXT("medium"),
            },
        },
        {
            // database 모델 정의 부분. mysql은 db 생성 시 적용함.
            tableName: "visitor",
            freezeTableName: true,
            timestamps: false,
        }
    );
    return model;
};

module.exports = Visitor;
