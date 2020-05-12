const connection = require('../connection');
const Sequelize = require('sequelize');
const Item = require('./Item');

const ItemComponent = connection.define('item_component', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Item,
            key: 'id',
        }
    },
    component_of_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Item,
            key: 'id',
        }
    }
}, { timestamps: false, tableName: 'item_components' });

module.exports = ItemComponent;