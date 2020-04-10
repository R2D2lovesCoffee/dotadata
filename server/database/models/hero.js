const connection = require('../connection');
const Sequelize = require('sequelize');

module.exports = connection.define('hero', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    nickname: Sequelize.STRING,
}, { timestamps: false });