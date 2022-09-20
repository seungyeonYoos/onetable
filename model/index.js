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
db.Bookmark = require("./Bookmark")(sequelize, Sequelize);
db.Favorite = require("./Favorite")(sequelize, Sequelize);
db.Category = require("./Category")(sequelize, Sequelize);
db.Level = require("./Level")(sequelize, Sequelize);
db.Review = require("./Review")(sequelize, Sequelize);

// <table 여러 개 일 때 primary key foreign key 연결>

// Category와 Recipe 관계
db.Category.hasMany(db.Recipe, {
  foreignKey: "category_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Recipe.belongsTo(db.Category, {
  foreignKey: "category_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Level와 Recipe 관계
db.Level.hasMany(db.Recipe, {
  foreignKey: "level_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Recipe.belongsTo(db.Level, {
  foreignKey: "level_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// User와 Favorite
db.User.hasMany(db.Favorite, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Favorite.belongsTo(db.User, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Recipe와 Favorite
db.Recipe.hasMany(db.Favorite, {
  foreignKey: "recipe_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Favorite.belongsTo(db.Recipe, {
  foreignKey: "recipe_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// User와 Review
db.User.hasMany(db.Review, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Review.belongsTo(db.User, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Recipe와 Review
db.User.hasMany(db.Review, {
  foreignKey: "recipe_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Review.belongsTo(db.User, {
  foreignKey: "recipe_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

module.exports = db;
