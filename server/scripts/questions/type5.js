const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
const Sequelize = require('sequelize');
require('../../database/associations')();

const question = new Question();

question.meta = {
    subjectType: 'text',
    answersType: 'img'
}

question.setText('Which hero has this lore? ');

Hero.findAll({
    attributes: ['img_small_src', 'lore'],
    order: [
        db.fn('RAND')
    ],
    limit: 4
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        question.setAnswers(heroes.map(hero => hero.img_small_src));
        const correct = randomNumber(0, 3);
        question.setSubject(heroes[correct].lore);
        process.send({ question, correct });
    })