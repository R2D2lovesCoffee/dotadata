const connection = require('../connection');
const Sequelize = require('sequelize');

const Hero = require('./Hero');
module.exports = connection.define('spell', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hero_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Hero,
            key: 'id'
        }
    },
    name: Sequelize.STRING,
    hot_key: Sequelize.STRING,
    legacy_key: Sequelize.STRING,
    img_src: Sequelize.STRING,
    description: Sequelize.TEXT,
    lore: Sequelize.TEXT,
}, { timestamps: false });