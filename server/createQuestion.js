const Hero = require('./database/models/Hero');
const HeroDetail = require('./database/models/HeroDetail');
const Spell = require('./database/models/Spell');
const SpellDetail = require('./database/models/SpellDetail');
const SpellSound = require('./database/models/SpellSound');
const { parseSpell } = require('./scripts/parse');
const db = require('./database/connection');

const manager = { questionTypes: [] };

function Question(text, type) {
    this.text = text;
    this.type = type;
    this.answers = null;
    this.correctAnswer = null;
    this.extra = null;
    this.setAnswers = (answers) => this.answers = answers;
    this.setCorrectAnswer = correct => this.correctAnswer = correct;
    this.setExtra = extra => this.extra = extra;
}

const createQuestion = (type) => {
    const question = new Question(type);

}

manager.questionTypes.push(async () => {
    const q = new Question('Which spell plays this sound?');
    const spells = (await Spell.findAll({
        order: [
            [db.fn('RAND')]
        ],
        limit: 5
    })).map(spell => spell.dataValues);

    q.answers = spells;
    return q;
})

manager.questionTypes.push(async () => {
    return 'type2';
})

module.exports = createQuestion;