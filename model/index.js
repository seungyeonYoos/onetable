const Sequelize = require("sequelize");
const config = require("../config/config.json")["development"];

const db = {};
const sequelize = new Sequelize(
  config.database, // 데이터베이스
  config.username, // 사용자명
  config.password, // 비밀번호
  config // 정보 전체
);

db.sequelize = sequelize;

db.Sequelize = Sequelize;

// <예시용>
db.OneTable = require("./OneTable")(sequelize, Sequelize);

// <table 여러 개 일 때 primary key foreign key 연결>
// db.Payment = require("../Payment")(sequelize, Sequelize);

// db.User.hasMany(db.Payment, {
//     foreignKey: "user_ID",
//     sourceKey: "ID",
//     onDelete: "cascade"
// });

// db.Payment.belongsTo(db.User, {
//     foreignKey: "user_ID",
//     sourceKey: "ID",
//     onDelete: "cascade"
// })

module.exports = db;
