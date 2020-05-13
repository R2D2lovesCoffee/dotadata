const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const HeroDetails = require('../../database/models/HeroDetail');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
require('../../database/associations')();

const question = new Question();

question.meta = {
    subjectType: 'img',
    answersType: 'text'
}

question.setText("Who is this hero?");

Hero.findAll({
    attributes: ['name', 'img_medium_src'],
    order: [
        db.fn('RAND')
    ],
    limit: 4,
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        question.setAnswers(heroes.map(hero => hero.name));
        const correctIndex = randomNumber(0, 3);
        question.setSubject(heroes[correctIndex].img_medium_src);
        console.log(question);
        process.send({ question, correctIndex });
    })


// process.send({ message: 'hello from type2' });