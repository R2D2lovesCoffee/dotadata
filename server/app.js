const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


app.use(require('cors')());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const Hero = require('./database/models/Hero');
const Spell = require('./database/models/Spell');
const HeroDetail = require('./database/models/HeroDetail');
const SpellSound = require('./database/models/SpellSound');
const SpellDetail = require('./database/models/SpellDetail');
const { parseSpell } = require('./scripts/parse');

app.get('/api/heroes', async (req, res) => {
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
    })
        .catch(err => console.log(err));
})

app.use(express.static(path.join(__dirname, '../dota-data/build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../dota-data/build', 'index.html'));
});

module.exports = app;