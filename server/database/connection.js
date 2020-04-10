const Sequelize = require('sequelize');
const config = require('../config');
module.exports = new Sequelize(config.DBNAME, config.DBUSER, config.DBPASS, {
    host: config.DBHOST,
    dialect: config.DBDIALECT,
    dialectOptions: {
        multipleStatements: true
    }
})