const connection = require('../connection');
const Sequelize = require('sequelize');
const Item = require('./Item');

const ItemBonus = connection.define('item_bonus', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Item,
            key: 'id'
        }
    },
    description: Sequelize.TEXT,
}, { timestamps: false, tableName: 'item_bonuses' });

module.exports = ItemBonus;