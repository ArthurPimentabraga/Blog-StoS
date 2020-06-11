const Sequelize = require("sequelize");
const connection = require("./../../database/connection");
const CategoryModel = require("./../categories/CategoryModel");

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

CategoryModel.hasMany(ArticleModel); //Relacionamento (Cada categoria contém vários artigos) 
ArticleModel.belongsTo(CategoryModel);
module.exports = ArticleModel;