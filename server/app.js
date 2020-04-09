const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const heroManager = require('./scripts/hero');
const spellManager = require('./scripts/spell');

app.get('/heroes', async (req, res) => {
    const { name } = req.query;
    const heroes = await heroManager.getHeroesStats();
    const hero = heroes.find(hero => hero.name === name);
    const heroData = await heroManager.getHeroData(name);
    const heroDetails = await heroManager.getHeroDetails(name);
    const spells = await spellManager.getHeroSpells(name);
    res.send({ ...hero, ...heroData, ...heroDetails, spells })
})

module.exports = app;