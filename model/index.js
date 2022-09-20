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

db.User = require("./User")(sequelize, Sequelize);
db.Recipe = require("./Recipe")(sequelize, Sequelize);
db.UserWishList = require("./UserWishList")(sequelize, Sequelize);
db.UserLikes = require("./UserLikes")(sequelize, Sequelize);
db.Step = require("./Step")(sequelize, Sequelize);
db.Ingredient = require("./Ingredient")(sequelize, Sequelize);
db.Measurement = require("./Measurement")(sequelize, Sequelize);

db.Recipe.hasMany(db.Step, {
    foreignKey: "recipe_id",
    sourceKey: "id",
    onDelete: "cascade",
    onUpdate: "cascade",
});

db.Step.belongsTo(db.Recipe, {
    foreignKey: "recipe_id",
    sourceKey: "id",
    onDelete: "cascade",
    onUpdate: "cascade",
});

db.Recipe.hasMany(db.RecipeIngredients, {
    foreignKey: "recipe_id",
    sourceKey: "id",
    onDelete: "cascade",
    onUpdate: "cascade",
});

db.RecipeIngredients.belongsTo(db.Recipe, {
    foreignKey: "recipe_id",
    sourceKey: "id",
    onDelete: "cascade",
    onUpdate: "cascade",
});

db.Ingredient.hasMany(db.RecipeIngredients, {
    foreignKey: "ingredient_id",
    sourceKey: "id",
    onDelete: "cascade",
    onUpdate: "cascade",
});

db.RecipeIngredients.belongsTo(db.Ingredient, {
    foreignKey: "ingredient_id",
    sourceKey: "id",
    onDelete: "cascade",
    onUpdate: "cascade",
});

db.Measurement.hasMany(db.RecipeIngredients, {
    foreignKey: "measurement_id",
    sourceKey: "id",
    onDelete: "cascade",
    onUpdate: "cascade",
});

db.RecipeIngredients.belongsTo(db.Measurement, {
    foreignKey: "measurement_id",
    sourceKey: "id",
    onDelete: "cascade",
    onUpdate: "cascade",
});

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
