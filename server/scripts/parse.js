

module.exports.parseSpell = spell => {
            spell = spell.dataValues;
            ['mana', 'cooldown'].forEach(type => {
                let raw = spell.spellDetails.find(elem => elem.type === type);
                spell[type] = {};
                ['default', 'aghs', 'talents', 'both'].forEach(val => {
                    spell[type][val] = raw[val] ? raw[val].split('-').map(elem => {
                        if(!isNaN(elem)) {
                            return Number(elem);
                        }
                        return elem;
                    }) : null;
                })
            })
            delete spell.spellDetails;
            return spell;
}