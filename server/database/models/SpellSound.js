const connection = require('../connection');
const Sequelize = require('sequelize');
const Spell = require('./Spell');

module.exports = connection.define('spell_sound', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    spell_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Spell,
            key: 'id'
        }
    },
    src: Sequelize.STRING,
}, { timestamps: false, tableName: 'spell_sounds' });