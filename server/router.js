const router = require('express').Router();
const { fork } = require('child_process');
const Hero = require('./database/models/Hero');
const HeroDetail = require('./database/models/HeroDetail');
const Spell = require('./database/models/Spell');
const SpellDetail = require('./database/models/SpellDetail');
const SpellSound = require('./database/models/SpellSound');
const { parseSpell } = require('./scripts/parse');
const { randomNumber } = require('./scripts/utils');
const Question = require('./scripts/questions/Question');

router.get('/heroes', async (req, res) => {
    const { name } = req.query;
    Hero.findOne({
        where: { name }, include: [
            { model: HeroDetail, as: 'heroDetails' },
            {
                model: Spell, as: 'spells', include: [
                    { model: SpellSound, as: 'sounds' },
                    { model: SpellDetail, as: 'spellDetails' }
                ]
            },
        ]
    }).then(hero => hero.dataValues).then(hero => {
        hero.spells = hero.spells.map(spell => parseSpell(spell))
        res.send(hero);
    }).catch(err => console.log(err));
})

router.get('/random-question', async (req, res) => {
    const random = 1;
    const child = fork(`./scripts/questions/type${random}`);
    child.on('message', question => {
        child.kill();
        res.send(question);
    });
    child.on('error', err => {
        console.log('ERROR WHEN RUNNING SCRIPT type' + random);
        console.log(err);
        child.kill();
    });
})

module.exports = router;