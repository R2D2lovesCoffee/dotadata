const connection = require('../connection');
const Sequelize = require('sequelize');

const Hero = require('./hero');
module.exports = connection.define('spell', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    hero_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Hero,
            key: 'id'
        }
    }
}, { timestamps: false });