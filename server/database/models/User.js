const connection = require('../connection');
const Sequelize = require('sequelize');

module.exports = connection.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    email: Sequelize.STRING,
    password_hash: Sequelize.STRING
    
}, { timestamps: false, tableName: 'users' });