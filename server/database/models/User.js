const connection = require('../connection');
const Sequelize = require('sequelize');

module.exports = connection.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: Sequelize.STRING,
    password_hash: Sequelize.STRING,
    verification_token: Sequelize.STRING,
    solo_mmr: Sequelize.INTEGER,
    ranked_mmr: Sequelize.INTEGER,
    nickname: Sequelize.STRING,
    image: Sequelize.STRING,
    active: Sequelize.BOOLEAN
}, { timestamps: false, tableName: 'users' });