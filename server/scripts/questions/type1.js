const Spell = require('../../database/models/Spell');
const SpellSound = require('../../database/models/SpellSound');
const db = require('../../database/connection');
const { randomNumber } = require('../utils');
require('../../database/associations')();

const Question = require('./Question');
const question = new Question();
question.meta = {
    subjectType: 'audio',
    answersType: 'img'
}
question.setText('Which spell plays this sound?');
Spell.findAll({
    attributes: ['img_src'],
    order: [
        [db.fn('RAND')]
    ],
    limit: 4,
    include: [
        { model: SpellSound, as: 'sounds', attributes: ['src'], required: true }
    ]
}).then(spells => spells.map(spell => spell.dataValues))
    .then(spells => {
        question.setAnswers(spells.map(spell => spell.img_src));
        const correct = randomNumber(0, 3);
        question.setSubject(spells[correct].sounds[0].src);
        process.send({ question, correct });
    })
