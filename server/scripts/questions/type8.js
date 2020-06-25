const Question = require('./Question');
const Hero = require('../../database/models/Hero');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
const Sequelize = require('sequelize');
const Spell = require('../../database/models/Spell');
const HeroDetail = require('../../database/models/HeroDetail');
const Item = require('../../database/models/Item');
require('../../database/associations')();

const question = new Question();

question.meta = {
    subjectType: 'img',
    answersType: 'text'
}

question.setText('What is the movement speed of this hero? ');

Hero.findAll({
    attributes: [`img_medium_src`],
    order: [
        db.fn('RAND')
    ],
    limit: 4,
    include: [
        { model: HeroDetail, as: 'heroDetails', attributes: ['ms'], required: true }
    ],
}).then(heroes => heroes.map(hero => hero.dataValues))
    .then(heroes => {
        const correct = randomNumber(0, 3);
        question.setSubject(heroes[correct].img_medium_src);
        if ((new Set(heroes.map(hero => hero.heroDetails.dataValues.ms))).size !== (heroes.map(hero => hero.heroDetails.dataValues.ms)).length) {
            HeroDetail.aggregate('ms', 'DISTINCT', { plain: false })
                .then(data => {
                    var arr = data.map(datas => datas.DISTINCT);
                    var selections = [];
                    for (var i = 0; i < 4; i++) {
                        var index = Math.floor(Math.random() * arr.length);
                        selections.push(arr[index]);
                        arr.splice(index, 1);
                    }

                    if (selections.indexOf((heroes.map(hero => hero.heroDetails.dataValues.ms)[correct])) === -1) {
                        var indexRemove = Math.floor(Math.random() * selections.length);
                        selections.splice(indexRemove, 1);
                        selections.splice(indexRemove, 0, (heroes.map(hero => hero.heroDetails.dataValues.ms)[correct]));
                        var correct1 = selections.indexOf(heroes.map(hero => hero.heroDetails.dataValues.ms)[correct]);
                        question.setAnswers(selections);
                        process.send({ question, correct1 })
                    }
                    var correct2 = selections.indexOf(heroes.map(hero => hero.heroDetails.dataValues.ms)[correct]);
                    question.setAnswers(selections)
                    process.send({ question, correct2 })
                })
        } else {
            question.setAnswers(heroes.map(hero => hero.heroDetails.dataValues.ms))
            process.send({ question, correct });
        }
    })