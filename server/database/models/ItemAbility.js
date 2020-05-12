const connection = require('../connection');
const Sequelize = require('sequelize');
const Item = require('./Item');

const ItemAbility = connection.define('item_ability', {
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
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
}, { timestamps: false, tableName: 'item_abilities' });

module.exports = ItemAbility;