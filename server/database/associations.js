
const Hero = require('./models/Hero');
const Spell = require('./models/Spell');
const HeroDetail = require('./models/HeroDetail');
const SpellSound = require('./models/SpellSound');
const SpellDetail = require('./models/SpellDetail');
const Item = require('./models/Item');
const ItemAbility = require('./models/ItemAbility');
const ItemBonus = require('./models/ItemBonus');
const ItemComponent = require('./models/ItemComponent');

module.exports = () => {
    Hero.hasOne(HeroDetail, { as: 'heroDetails', foreignKey: 'hero_id' });
    HeroDetail.belongsTo(Hero, { as: 'hero', foreignKey: 'hero_id' });
    Hero.hasMany(Spell, { as: 'spells', foreignKey: 'hero_id' });
    Spell.belongsTo(Hero, { as: 'hero', foreignKey: 'hero_id' });
    Spell.hasMany(SpellSound, { as: 'sounds', foreignKey: 'spell_id' });
    SpellSound.belongsTo(Spell, { as: 'spell', foreignKey: 'spell_id' });
    Spell.hasMany(SpellDetail, { as: 'spellDetails', foreignKey: 'spell_id' });
    SpellDetail.belongsTo(Spell, { as: 'spell', foreignKey: 'spell_id' });
    Item.hasMany(ItemAbility, { as: 'abilities', foreignKey: 'item_id' });
    ItemAbility.belongsTo(Item, { as: 'item', foreignKey: 'item_id' });
    Item.hasMany(ItemBonus, { as: 'bonuses', foreignKey: 'item_id' });
    ItemBonus.belongsTo(Item, { as: 'item', foreignKey: 'item_id' });
}