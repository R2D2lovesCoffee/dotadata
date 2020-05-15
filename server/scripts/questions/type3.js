const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
const Sequelize = require('sequelize');
require('../../database/associations')();

const question = new Question();
const attr = ['str', 'agi', 'int'][Math.floor(Math.random() * 2)];

let obj = {
    str: 'strength',
    agi: 'agility',
    int: 'inteligence'
}


question.meta = {
    subjectType: 'none',
    answersType: 'text'
}

<<<<<<< HEAD
question.setText(`Which hero has the most ${obj[attr]} at level 1 ? `);
=======
question.setText('Which hero has the most strength at level 1?');
>>>>>>> 89b757e2305e70a606762f3a2407cbcd6787aa63

Hero.findAll({
    attributes: [[Sequelize.literal(`DISTINCT ${attr}`), `${attr}`], 'name'],
    order: [
        db.fn('RAND')
    ],
    limit: 4
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        question.setAnswers(heroes.map(hero => hero.name));
        question.setSubject(null);
        const arrayStr = heroes.map(hero => hero[attr]);
        const correct = arrayStr.indexOf(Math.max(...arrayStr));
        process.send({ question, correct });
    })