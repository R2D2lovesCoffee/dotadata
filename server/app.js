const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const Hero = require('./database/models/Hero');
const Spell = require('./database/models/Spell');
const HeroDetail = require('./database/models/HeroDetail');
const SpellSound = require('./database/models/SpellSound');

app.get('/heroes', async (req, res) => {
    const { name } = req.query;
    Hero.findOne({
        where: { name }, include: [
            { model: HeroDetail, as: 'heroDetails' },
            {
                model: Spell, as: 'spells', include: [
                    { model: SpellSound, as: 'sounds' }
                ]
            },
        ]
    }).then(hero => {
        res.send(hero);
    })
        .catch(err => console.log(err));
})

module.exports = app;