const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const HeroDetails = require('../../database/models/HeroDetail');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
require('../../database/associations')();

const question = new Question();

question.meta = {
    subjectType: 'img',
    answerType: 'text'
}

question.setText("who is this hero?");

Hero.findAll({
    attributes: ['img_src'],
    order: [
        db.fn('RAND')
    ],
    limit: 4,
    include: [
        { model: HeroDetails, as: heroes, attributes: ['src'], required: true }
    ]
})


// process.send({ message: 'hello from type2' });