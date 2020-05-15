const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
const Sequelize = require('sequelize');
require('../../database/associations')();

const question = new Question();

question.meta = {
    subjectType: 'audio',
    answersType: 'text'
}

question.setText('Which hero is presented by the audio? ');

Hero.findAll({
    attributes: ['audio_bio_src', 'name'],
    order: [
        db.fn('RAND')
    ],
    limit: 4
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        question.setAnswers(heroes.map(hero => hero.name));
        const correct = randomNumber(0, 3);
        question.setSubject(heroes[correct].audio_bio_src);
        process.send({ question, correct });
    })