const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
require('../../database/associations')();

const question = new Question();

question.meta = {
    subjectType: null,
    answersType: 'text'
}

question.setText('Which hero has the most strength at level 1.');

Hero.findAll({
    attributes: ['str', 'name'],
    order: [
        db.fn('RAND')
    ],
    limit: 4
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        question.setAnswers(heroes.map(hero => hero.name));
        const correct = randomNumber(0, 3);
        question.setSubject(heroes[correct].str);
        console.log(question);
    })


//process.send({ message: 'hello from type3' });