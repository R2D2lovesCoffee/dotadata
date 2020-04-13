
const Hero = require('./models/Hero');
const Spell = require('./models/Spell');
const HeroDetail = require('./models/HeroDetail');
const SpellSound = require('./models/SpellSound');

module.exports = () => {
    Hero.hasOne(HeroDetail, { as: 'heroDetails', foreignKey: 'hero_id' });
    HeroDetail.belongsTo(Hero, { as: 'hero', foreignKey: 'hero_id' });
    Hero.hasMany(Spell, { as: 'spells', foreignKey: 'hero_id' });
    Spell.belongsTo(Hero, { as: 'hero', foreignKey: 'hero_id' });
    Spell.hasMany(SpellSound, { as: 'sounds', foreignKey: 'spell_id' })
    SpellSound.belongsTo(Spell, { as: 'spell', foreignKey: 'spell_id' });
}