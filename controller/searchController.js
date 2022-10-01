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

exports.main = (req, res) => {
  res.render("search");
};
