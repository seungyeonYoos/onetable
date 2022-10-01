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
  res.render("search");
};

// 검색
async function getCourses(searchWord) {
  const query = `SELECT * FROM course 
                WHERE name LIKE '%${searchWord}%';`;
  const courses = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return courses;
}
async function getRecipes(searchWord) {
  const query = `SELECT * FROM recipe
                WHERE title LIKE '%${searchWord}%';`;
  const recipes = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return recipes;
}
exports.search = async (req, res) => {
  const courseData = await getCourses(req.query.search);
  console.log("search_courseData:", courseData);
  const recipeData = await getRecipes(req.query.search);
  console.log("search_recipeData:", recipeData);
  const searchWord = req.query.search;
  res.render("search", { searchWord, courseData, recipeData });
};
