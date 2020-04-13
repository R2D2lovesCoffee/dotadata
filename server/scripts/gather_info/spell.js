const axios = require('axios');
const { parse } = require('node-html-parser');
const { rawTextToNumber } = require('../utils');
const exported = {};

exported.getHeroSpells = heroName => {
    let heroNameForURL = heroName.replace(/\s/g, '_');

    return axios.get(`https://dota2.gamepedia.com/${heroNameForURL}`).then(response => response.data).then(data => {
        const root = parse(data);
        const spellDivs = root.querySelectorAll('.ability-background');
        return spellDivs.map(spellDiv => {
            const spellCard = spellDiv.parentNode.childNodes[0].childNodes[0];
            // const spellNotes = spellDivs[3].parentNode.childNodes[2];
            const parts = spellCard.childNodes.filter(elem => elem.tagName === 'div');
            return { ...getSpellInfo1(parts[0]), ...getSpellInfo2(parts[1]), ...getSpellInfo3(parts[2], heroName) };
        })

    })
}

const getSpellInfo2 = root => {
    const img = root.childNodes[0].childNodes.find(elem => elem.tagName === 'a').childNodes.find(elem => elem.tagName === 'img').getAttribute('src');
    const divsRight = root.childNodes[2].childNodes.filter(elem => elem.tagName === 'div');
    const description = divsRight[1].rawText;
    const generalsNodes = divsRight[0].childNodes.filter(elem => elem.tagName === 'div');
    const generals = {};
    abilitiesRaw = generalsNodes[0].rawText.split('Ability')[1]
    affectsRaw = generalsNodes[1].rawText.split('Affects')[1];
    damageRaw = generalsNodes[2].rawText.split('Damage')[1];

    if (damageRaw) {
        const aAghsDamage = generalsNodes[2].childNodes.filter(elem => elem.tagName === 'a').find(elem => elem.getAttribute('title') === 'Upgradable by Aghanim\'s Scepter.');
        const aTalentsDamage = generalsNodes[2].childNodes.filter(elem => elem.tagName === 'a').find(elem => elem.getAttribute('title') === 'Talent');
        if (aAghsDamage) {
            generals.damage = {
                default: damageRaw.split('(')[0].trim().split('/').map(elem => elem.trim()),
                aghs: damageRaw.split(';')[1].trim().split(')')[0].trim().split('/').map(elem => elem.trim()),
            }
        } else if (aTalentsDamage) {
            generals.damage = {
                default: damageRaw.split('(')[0].trim().split('/').map(elem => elem.trim()),
                talents: damageRaw.split(';')[1].trim().split(')')[0].trim().split('/').map(elem => elem.trim())
            }
        } else {
            generals.damage = {
                default: damageRaw.split('/').map(elem => elem.trim()),
            }
        }
    } else {
        generals.damage = null;
    }
    if (abilitiesRaw) {
        const aAghsDamage = generalsNodes[0].childNodes.filter(elem => elem.tagName === 'a').find(elem => elem.getAttribute('title') === 'Upgradable by Aghanim\'s Scepter.');
        const aTalentsDamage = generalsNodes[0].childNodes.filter(elem => elem.tagName === 'a').find(elem => elem.getAttribute('title') === 'Talent');
        if (aAghsDamage) {
            generals.ability = {
                default: abilitiesRaw.split('(')[0].trim().split('/').map(elem => elem.trim()),
                aghs: abilitiesRaw.split(';')[1].trim().split(')')[0].trim().split('/').map(elem => elem.trim()),
            }
        } else if (aTalentsDamage) {
            generals.ability = {
                default: abilitiesRaw.split('(')[0].trim().split('/').map(elem => elem.trim()),
                talents: abilitiesRaw.split(';')[1].trim().split(')')[0].trim().split('/').map(elem => elem.trim())
            }
        } else {
            generals.ability = {
                default: abilitiesRaw.split('/').map(elem => elem.trim()),
            }
        }
    } else {
        generals.ability = null;
    }
    if (affectsRaw) {
        const aAghsDamage = generalsNodes[1].childNodes.filter(elem => elem.tagName === 'a').find(elem => elem.getAttribute('title') === 'Upgradable by Aghanim\'s Scepter.');
        const aTalentsDamage = generalsNodes[1].childNodes.filter(elem => elem.tagName === 'a').find(elem => elem.getAttribute('title') === 'Talent');
        if (aAghsDamage) {
            generals.affects = {
                default: affectsRaw.split('(')[0].trim().split('/').map(elem => elem.trim()),
                aghs: affectsRaw.split(';')[1].trim().split(')')[0].trim().split('/').map(elem => elem.trim()),
            }
        } else if (aTalentsDamage) {
            generals.affects = {
                default: affectsRaw.split('(')[0].trim().split('/').map(elem => elem.trim()),
                aghs: [],
                talents: affectsRaw.split(';')[1].trim().split(')')[0].trim().split('/').map(elem => elem.trim())
            }
        } else {
            generals.affects = {
                default: affectsRaw.split('/').map(elem => elem.trim()),
            }
        }
    } else {
        generals.affects = null
    }
    return { img, description, generals };
}

const getSpellInfo3 = (root, name) => {
    const kids = root.childNodes.filter(node => node.tagName === 'div');
    let loreNode = null;
    if (kids[kids.length - 1]) {
        loreNode = kids[kids.length - 1].childNodes.find(elem => elem.tagName === 'i');
    }
    const lore = loreNode ? loreNode.rawText : '';
    let cooldown = null;
    let mana = null;

    const props = {};
    kids.forEach(kidDiv => {
        if (!kidDiv.getAttribute('style')) {
            let parts = kidDiv.rawText.split(':')[0].replace(/\//g, ' or ').split(' ');
            let prop = '';
            parts.forEach(part => prop += part.toLowerCase() + '_');
            prop = prop.slice(0, prop.length - 1);
            if (prop !== 'cast_animation') {
                props[prop] = {};
            }
            let spanNode = kidDiv.childNodes.find(elem => elem.tagName === 'span');
            let aTags = spanNode.childNodes.filter(elem => elem.tagName === 'a');
            if (!aTags.length) {
                const spanKids = kidDiv.childNodes.filter(elem => elem.tagName === 'span');
                if (spanKids.length > 1 && spanKids[0].getAttribute('title') === 'Cast point' && spanKids[1].getAttribute('title') === 'Cast backswing') {
                    props.cast_point = { default: spanKids[0].rawText.split('/').map(elem => rawTextToNumber(elem)) };
                    props.cast_backswing = { default: spanKids[1].rawText.split('/').map(elem => rawTextToNumber(elem)) };
                } else {
                    props[prop].default = spanNode.rawText.split('/').map(elem => rawTextToNumber(elem));
                }
            } else {
                let talentATag = aTags.find(elem => elem.getAttribute('title') === 'Talent');
                let aghsATag = aTags.find(elem => elem.getAttribute('title') === 'Upgradable by Aghanim\'s Scepter.');

                props[prop].default = spanNode.rawText.split('&')[0].split('/').map(elem => rawTextToNumber(elem));

                if (talentATag) {
                    props[prop].talents = spanNode.rawText.substring(spanNode.rawText.indexOf('(') + 1, spanNode.rawText.indexOf(')')).trim().split('/').map(elem => rawTextToNumber(elem))
                }
                if (aghsATag && !talentATag) {
                    props[prop].aghs = spanNode.rawText.substring(spanNode.rawText.indexOf('(') + 1, spanNode.rawText.indexOf(')')).trim().split('/').map(elem => rawTextToNumber(elem))
                }
                if (aghsATag) {
                    props[prop].aghs = props[prop].talents ? spanNode.rawText.substring(spanNode.rawText.lastIndexOf('(') + 1, spanNode.rawText.indexOf(',')).trim().split('/').map(elem => rawTextToNumber(elem)) : spanNode.rawText.substring(spanNode.rawText.indexOf('(') + 1, spanNode.rawText.indexOf(')')).trim().split('/').map(elem => rawTextToNumber(elem))
                }
                if (aghsATag) {
                    props[prop].aghs = props[prop].talents ? spanNode.rawText.substring(spanNode.rawText.lastIndexOf('(') + 1, spanNode.rawText.indexOf(',')).trim().split('/').map(elem => rawTextToNumber(elem)) : spanNode.rawText.substring(spanNode.rawText.indexOf('(') + 1, spanNode.rawText.indexOf(')')).trim().split('/').map(elem => rawTextToNumber(elem))
                }

                if (props[prop].talents && props[prop].aghs) {
                    props[prop].both = spanNode.rawText.substring(spanNode.rawText.indexOf(',') + 1, spanNode.rawText.lastIndexOf(')')).trim().split('/').map(elem => rawTextToNumber(elem))
                }

                let problem = false;
                Object.keys(props[prop]).forEach(key => problem = props[prop][key].some(elem => typeof elem !== 'number'));
                if (problem) {
                    console.log('PROBLEM FOR PROP ' + prop + ' at hero ' + name);
                }
            }
        } else {
            const rawText = kidDiv.rawText;

            let spanKids = kidDiv.childNodes.filter(elem => elem.tagName === 'span');
            if (spanKids.length && spanKids[0] && spanKids[0].childNodes.find(elem => elem.tagName === 'a') && spanKids[0].childNodes.find(elem => elem.tagName === 'a').getAttribute('title') === 'Cooldown') {
                cooldown = {};
                // here is the div with cooldown data
                if (spanKids[1] && spanKids[1].childNodes.find(elem => elem.tagName === 'a') && spanKids[1].childNodes.find(elem => elem.tagName === 'a').getAttribute('title') === 'Talent') {
                    // i have a talent cooldown update
                    cooldown.default = rawText.trim().split('&')[0].split('/').map(elem => rawTextToNumber(elem));
                    cooldown.talents = rawText.trim().substring(rawText.trim().indexOf('(') + 1, rawText.trim().indexOf(')')).split('/').map(elem => rawTextToNumber(elem));
                    // cooldown.aghs = null;
                } else if (spanKids[1] && spanKids[1].childNodes.find(elem => elem.tagName === 'a') && spanKids[1].childNodes.find(elem => elem.tagName === 'a').getAttribute('title') === 'Upgradable by Aghanim\'s Scepter.') {
                    // i have an aghs cooldown update
                    cooldown.default = rawText.trim().split('&')[0].split('/').map(elem => rawTextToNumber(elem));
                    cooldown.aghs = rawText.trim().substring(rawText.trim().indexOf('(') + 1, rawText.trim().indexOf(')')).split('/').map(elem => rawTextToNumber(elem));
                    // cooldown.talents = null;
                } else {
                    cooldown.default = rawText.trim().split('/').map(elem => rawTextToNumber(elem));
                }
            }
            if (spanKids.length && spanKids[0] && spanKids[0].childNodes.find(elem => elem.tagName === 'a') && spanKids[0].childNodes.find(elem => elem.tagName === 'a').getAttribute('title') === 'Mana') {
                // here is the div with mana data
                mana = {};
                if (spanKids[1] && spanKids[1].childNodes.find(elem => elem.tagName === 'a') && spanKids[1].childNodes.find(elem => elem.tagName === 'a').getAttribute('title') === 'Talent') {
                    // i have a talent mana update
                    mana.default = rawText.trim().split('&')[0].split('/').map(elem => rawTextToNumber(elem));
                    mana.talents = rawText.trim().substring(rawText.trim().indexOf('(') + 1, rawText.trim().indexOf(')')).split('/').map(elem => rawTextToNumber(elem));
                    // mana.aghs = null;
                } else if (spanKids[1] && spanKids[1].childNodes.find(elem => elem.tagName === 'a') && spanKids[1].childNodes.find(elem => elem.tagName === 'a').getAttribute('title') === 'Upgradable by Aghanim\'s Scepter.') {
                    // i have an aghs mana update
                    mana.default = rawText.trim().split('&')[0].split('/').map(elem => rawTextToNumber(elem));
                    mana.aghs = rawText.trim().substring(rawText.trim().indexOf('(') + 1, rawText.trim().indexOf(')')).split('/').map(elem => rawTextToNumber(elem));
                    // mana.talents = null;
                } else {
                    mana.default = rawText.trim().split('/').map(elem => rawTextToNumber(elem));
                }
            }

        }
    });
    return { lore, cooldown, mana, props };
}

const getSpellInfo1 = root => {
    const name = root.childNodes[0].rawText;
    const links = root.childNodes[1];

    const soundNodes = links.childNodes.filter(elem => elem.tagName === 'span');
    let sounds;
    try {
        sounds = soundNodes.map(soundNode => soundNode.childNodes.find(elem => elem.tagName === 'span').childNodes.find(elem => elem.tagName === 'audio').childNodes.find(elem => elem.tagName === 'source').getAttribute('src'));
    } catch (err) {
        sounds = null;
    }

    const keyNodes = links.childNodes.filter(elem => elem.tagName === 'div');
    let hotKey = null;
    let legacyKey = null;
    if (keyNodes[0] && keyNodes[1]) {
        hotKey = keyNodes[0].childNodes.find(elem => elem.tagName === 'span').rawText;
        legacyKey = keyNodes[1].childNodes.find(elem => elem.tagName === 'span').rawText;
    }

    const interactNodes = links.childNodes.filter(elem => elem.tagName === 'a');
    const interacts = interactNodes.map(interactNode => {
        const img = interactNode.childNodes.find(elem => elem.tagName === 'img');
        return { img: img.getAttribute('src'), description: img.getAttribute('alt') }
    })
    return { sounds: sounds, name, hotKey, legacyKey, interacts };
}

module.exports = exported;