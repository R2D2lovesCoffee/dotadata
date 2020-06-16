const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
const Sequelize = require('sequelize');
require('../../database/associations')();

const question = new Question();

question.meta = {
    subjectType: 'img',
    answersType: 'text'
}

question.setText('Is this hero melee or ranged?');

Hero.findAll({
    attributes: ['range', 'img_medium_src'],
    order: [
        db.fn('RAND')
    ],
    limit: 2
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        const heroRange = ['melee', 'ranged'];

        heroes.map(hero => hero.range)[0] = 'melee';
        heroes.map(hero => hero.range)[1] = 'ranged';
        let correct = null;

        if (heroes.map(hero => hero.range)[0] === heroRange[0]) {
            correct = 0;
        }
        if (heroes.map(hero => hero.range)[1] === heroRange[1]) {
            correct = 1;
        }
        if (correct === null) {
            if (heroes.map(hero => hero.range)[0] === heroRange[0]) {
                correct = 0;
            }
            if (heroes.map(hero => hero.range)[1] === heroRange[1]) {
                correct = 1;
            }
        }
        question.setAnswers(heroRange.map(heroR => heroR.charAt(0).toUpperCase() + heroR.slice(1)));
        question.setSubject(heroes[correct].img_medium_src);
        process.send({ question, correct });
    })
