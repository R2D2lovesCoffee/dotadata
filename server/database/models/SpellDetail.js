const connection = require('../connection');
const Sequelize = require('sequelize');
const Spell = require('./Spell');

module.exports = connection.define('spell_detail', {
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
    type: Sequelize.STRING,
    default: Sequelize.STRING,
    aghs: Sequelize.STRING,
    talents: Sequelize.STRING,
    both: Sequelize.STRING,

}, { timestamps: false, tableName: 'spell_details' });