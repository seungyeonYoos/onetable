const { query } = require("express");
const { QueryTypes } = require("sequelize");
const {
  Course,
  User,
  Application,
  CourseFavorite,
  CourseReview,
  sequelize,
} = require("../model");

exports.main = async (req, res) => {
  let courseData = [];
  let recipeData = [];
  let countRecipe = [];
  let countCourse = [];
  let count;
  res.render("search", {
    courseData,
    recipeData,
    countRecipe,
    countCourse,
    count,
    popup: req.cookies.popup,
  });
};

// 검색
async function getRecipes(searchWord) {
  const query = `SELECT *
                FROM recipe LEFT OUTER JOIN level
                ON recipe.level_id = level.id
                WHERE title LIKE '%${searchWord}%';`;
  const recipes = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return recipes;
}
async function getCourses(searchWord) {
  const query = `SELECT * FROM course 
                WHERE name LIKE '%${searchWord}%';`;
  const courses = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return courses;
}
exports.search = async (req, res) => {
  const searchWord = req.query.search;
  const recipeData = await getRecipes(req.query.search);
  console.log("search_recipeData:", recipeData);
  const courseData = await getCourses(req.query.search);
  console.log("search_courseData:", courseData);
  res.render("search", {
    searchWord,
    recipeData,
    courseData,
    popup: req.cookies.popup,
  });
};
