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

async function all() {
    const heroes = await heroManager.getHeroesStats();
    heroes.shift();
    let total = 0;
    for (hero of heroes) {
        const { name } = hero;
        await heroManager.getHeroData(name);
        await heroManager.getHeroDetails(name);
        await spellManager.getHeroSpells(name);
        total++;
        console.log(hero.name + ' done' + '(total:' + total + ')');
    }
    console.log('done');
}
// all();
module.exports = app;