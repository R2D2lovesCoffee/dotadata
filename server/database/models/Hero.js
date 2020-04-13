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
    description: Sequelize.TEXT,
    range: {
        type: Sequelize.ENUM,
        values: ['melee', 'ranged'],
    },
    img_small_src: Sequelize.STRING,
    img_medium_src: Sequelize.STRING,
    audio_bio_src: Sequelize.STRING,
    lore: Sequelize.TEXT,
    str: Sequelize.INTEGER,
    str_per_lv: Sequelize.INTEGER,
    agi: Sequelize.INTEGER,
    agi_per_lv: Sequelize.INTEGER,
    int: Sequelize.INTEGER,
    int_per_lv: Sequelize.INTEGER,
}, { timestamps: false, tableName: 'heroes' });