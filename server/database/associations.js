const Hero = require('./models/hero');
const Spell = require('./models/spell');

module.exports = () => {
    Hero.hasMany(Spell, { as: 'spells', foreignKey: 'hero_id' });
    Spell.belongsTo(Hero, { as: 'hero', foreignKey: 'hero_id' });
}