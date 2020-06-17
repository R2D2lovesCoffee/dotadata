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
        let correct = null;

        if (heroes[0].range === 'melee' && heroes[1].range === 'ranged') {
            correct = Math.round(Math.random());
            if (heroes[correct].range.indexOf('melee') === -1) {
                var correctCheck = 1
            } else {
                correctCheck = 0;
            }
            question.setSubject(heroes[correctCheck].img_medium_src);
        }
        if (heroes[0].range === 'ranged' && heroes[1].range === 'melee') {
            correct = Math.round(Math.random());
            if (heroes[correct].range.indexOf('melee') === -1) {
                var correctCheck = 1
            } else {
                correctCheck = 0;
            }
            question.setSubject(heroes[correctCheck].img_medium_src);
        }
        if (heroes[0].range === 'melee' && heroes[1].range === 'melee') {
            correct = 0;
            question.setSubject(heroes[correct].img_medium_src);
        }
        if (heroes[0].range === 'ranged' && heroes[1].range === 'ranged') {
            correct = 1;
            question.setSubject(heroes[correct].img_medium_src);
        }

        console.log(correct);
        question.setAnswers(heroRange.map(heroR => heroR.charAt(0).toUpperCase() + heroR.slice(1)));
        console.log(question);
        process.send({ question, correct });
    })
