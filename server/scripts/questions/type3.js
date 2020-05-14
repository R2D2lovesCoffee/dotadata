const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
const Sequelize = require('sequelize');
require('../../database/associations')();

const question = new Question();

question.meta = {
    subjectType: 'none',
    answersType: 'text'
}

question.setText('Which hero has the most strength at level 1.');

Hero.findAll({
    attributes: [[Sequelize.literal('DISTINCT str'), 'str'], 'name'],
    order: [
        db.fn('RAND')
    ],
    limit: 4
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        question.setAnswers(heroes.map(hero => hero.name));
        question.setSubject(null);
        const arrayStr = heroes.map(hero => hero.str);
        const correct = arrayStr.indexOf(Math.max(...arrayStr));
        process.send({ question, correct });
    })