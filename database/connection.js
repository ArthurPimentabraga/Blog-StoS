const Sequelize = require("sequelize");

const connection = new Sequelize('blogStoS', 'root', '135531AA', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;