const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
const Sequelize = require('sequelize');
require('../../database/associations')();

const question = new Question();
const attr_per_lvl = ['int_per_lv', 'agi_per_lv', 'str_per_lv'][Math.floor(Math.random() * 2)];

let objPerLvl = {
    str_per_lv: 'strength',
    agi_per_lv: 'agility',
    int_per_lv: 'intelligence'
}

question.meta = {
    subjectType: 'none',
    answersType: 'text'
}

question.setText(`Which hero has the most ${objPerLvl[attr_per_lvl]} per level ? `);

Hero.findAll({
    attributes: [[Sequelize.literal(`DISTINCT ${attr_per_lvl}`), `${attr_per_lvl}`], 'name'],
    order: [
        db.fn('RAND')
    ],
    limit: 4
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        question.setAnswers(heroes.map(hero => hero.name));
        question.setSubject(null);
        const arrayStr = heroes.map(hero => hero[attr_per_lvl]);
        const correct = arrayStr.indexOf(Math.max(...arrayStr));
        process.send({ question, correct });
    })