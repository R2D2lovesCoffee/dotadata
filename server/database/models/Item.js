const connection = require('../connection');
const Sequelize = require('sequelize');

const Item = connection.define('item', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    img: Sequelize.STRING,
    lore: Sequelize.TEXT,
}, { timestamps: false, tableName: 'items' });

module.exports = Item;