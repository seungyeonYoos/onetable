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
db.Favorite = require("./Favorite")(sequelize, Sequelize);
db.Category = require("./Category")(sequelize, Sequelize);
db.Level = require("./Level")(sequelize, Sequelize);
db.Review = require("./Review")(sequelize, Sequelize);
db.Step = require("./Step")(sequelize, Sequelize);
db.Ingredient = require("./Ingredient")(sequelize, Sequelize);
db.Unit = require("./Unit")(sequelize, Sequelize);
db.RecipeIngredient = require("./RecipeIngredient")(sequelize, Sequelize);
db.Course = require("./Course")(sequelize, Sequelize);
db.Application = require("./Application")(sequelize, Sequelize);
db.ClassFavorite = require("./ClassFavorite")(sequelize, Sequelize);
db.ClassReview = require("./ClassReview")(sequelize, Sequelize);

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

db.Recipe.hasMany(db.RecipeIngredient, {
  foreignKey: "recipe_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.RecipeIngredient.belongsTo(db.Recipe, {
  foreignKey: "recipe_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.Ingredient.hasMany(db.RecipeIngredient, {
  foreignKey: "ingredient_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.RecipeIngredient.belongsTo(db.Ingredient, {
  foreignKey: "ingredient_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.Unit.hasMany(db.RecipeIngredient, {
  foreignKey: "unit_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

db.RecipeIngredient.belongsTo(db.Unit, {
  foreignKey: "unit_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

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

// User와 Recipe(작성자)
db.User.hasMany(db.Recipe, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Recipe.belongsTo(db.User, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// <Course부분> //
// User와 Application
db.User.hasMany(db.Application, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Application.belongsTo(db.User, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Course와 Application
db.Course.hasMany(db.Application, {
  foreignKey: "course_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Application.belongsTo(db.Course, {
  foreignKey: "course_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// User와 ClassFavorite
db.User.hasMany(db.ClassFavorite, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.ClassFavorite.belongsTo(db.User, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Course와 ClassFavorite
db.Course.hasMany(db.ClassFavorite, {
  foreignKey: "course_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.ClassFavorite.belongsTo(db.Course, {
  foreignKey: "course_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// User와 ClassReview
db.User.hasMany(db.ClassReview, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.ClassReview.belongsTo(db.User, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Course와 ClassReview
db.User.hasMany(db.ClassReview, {
  foreignKey: "course_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.ClassReview.belongsTo(db.User, {
  foreignKey: "course_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// User와 Course(작성자)
db.User.hasMany(db.Course, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});
db.Course.belongsTo(db.User, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

module.exports = db;
