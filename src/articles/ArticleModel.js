const Sequelize = require("sequelize");
const connection = require("./../../database/connection");
const categoryModel = require("./../categories/CategoryModel");

const ArticleModel = connection.define('article', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

categoryModel.hasMany(ArticleModel); //Relacionamento (Cada categoria contém vários artigos) 
module.exports = ArticleModel;