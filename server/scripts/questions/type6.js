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

question.setText('Is this hero ranged or melee?');

Hero.findAll({
    attributes: ['range', 'img_medium_src'],
    order: [
        db.fn('RAND')
    ],
    limit: 2
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        const heroRange = ['Melee', 'Ranged'];
        question.setAnswers(heroRange);
        if (heroRange !== heroes.map(hero => hero.range)) {
            heroes.map(hero => hero.range).splice(0, heroes.map(hero => hero.range).length, ...heroRange);
            //var correct = heroRange.indexOf('melee') === heroes.map(hero => hero.range).indexOf('melee') ? 0 : 1;
            //var correct = heroRange.includes('melee') === heroes.map(hero => hero.range).includes('melee') ? 0 : 1;
            if (heroRange[0] === heroes.map(hero => hero.range)[0]) {
                var correct = 0;
            }
            if (heroRange[1] === heroes.map(hero => hero.range)[1]) {
                var correct = 1;
            }
        }
        question.setSubject(heroes[correct].img_medium_src);
        process.send({ question, correct });
    })
