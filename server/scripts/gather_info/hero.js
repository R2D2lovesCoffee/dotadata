
const axios = require('axios');
const { parse } = require('node-html-parser');
const { rawTextToNumber } = require('../utils');

const exported = {};

exported.getHeroesNameAndSmallImage = () => {
    return axios.get('https://dota2.gamepedia.com/Heroes').then(response => response.data).then(data => {
        const root = parse(data);
        const tbody = root.querySelector('#mw-content-text').childNodes[0].childNodes[2].childNodes[1];
        const str = tbody.childNodes[2].childNodes[1].childNodes.filter(node => node.nodeType === 1);
        const agi = tbody.childNodes[6].childNodes[1].childNodes.filter(node => node.nodeType === 1);
        const intel = tbody.childNodes[10].childNodes[1].childNodes.filter(node => node.nodeType === 1);
        return [...str, ...agi, ...intel].map((heroDiv, index) => {
            const imgSmall = heroDiv.childNodes[0].childNodes[0].childNodes[0].getAttribute('src');
            const name = heroDiv.childNodes[1].childNodes[0].rawText;
            return { imgSmall, name }
        })
    })
}

exported.getHeroesStats = () => {
    return axios.get('https://dota2.gamepedia.com/Table_of_hero_attributes').then(response => response.data).then(data => {
        const root = parse(data);
        const tbody = root.querySelector('#mw-content-text').childNodes[0].childNodes.filter(node => node.nodeType === 1)[2].childNodes.filter(node => node.nodeType === 1)[0].childNodes.filter(node => node.nodeType === 1)[0];
        const trs = tbody.childNodes.filter(node => node.tagName === 'tr');
        return trs.map(tr => {
            const tds = tr.childNodes.filter(node => node.nodeType === 1);
            const name = tds[0].childNodes[0].rawText.trim();
            const str = rawTextToNumber(tds[2].rawText);
            const strPerLevel = rawTextToNumber(tds[3].rawText);
            const agi = rawTextToNumber(tds[5].rawText);
            const agiPerLevel = rawTextToNumber(tds[6].rawText);
            const int = rawTextToNumber(tds[8].rawText);
            const intPerLevel = rawTextToNumber(tds[9].rawText);
            return { name, str, strPerLevel, agi, agiPerLevel, int, intPerLevel }
        })
    })
}

exported.getHeroDetails = (name) => {
    let heroNameForURL = name.replace(/\s/g, '_');

    return axios.get(`https://dota2.gamepedia.com/${heroNameForURL}`).then(response => response.data).then(data => {
        const root = parse(data);
        // const content = root.querySelector('#mw-content-text').childNodes[0];
        // const tbody = content.childNodes[2].childNodes[1];
        const tbody = root.querySelector('.infobox').childNodes.find(elem => elem.tagName === 'tbody');
        const trs = tbody.childNodes.filter(elem => elem.tagName === 'tr');
        const inTbody = trs[1].childNodes.find(elem => elem.tagName === 'td').childNodes.find(elem => elem.tagName === 'table').childNodes.find(elem => elem.tagName === 'tbody');
        const inTrs = inTbody.childNodes.filter(elem => elem.tagName === 'tr');
        const hpTds = inTrs[1].childNodes.filter(elem => elem.tagName === 'td');
        const stats = {};
        stats.hpLv0 = rawTextToNumber(hpTds[0].childNodes[0].rawText);
        stats.hpLv1 = rawTextToNumber(hpTds[1].childNodes[0].rawText);
        stats.hpLv15 = rawTextToNumber(hpTds[2].childNodes[0].rawText);
        stats.hpLv25 = rawTextToNumber(hpTds[3].childNodes[0].rawText);
        stats.hpLv30 = rawTextToNumber(hpTds[4].childNodes[0].rawText);
        const hpRegTds = inTrs[2].childNodes.filter(elem => elem.tagName === 'td');
        stats.hpRegLv0 = rawTextToNumber(hpRegTds[0].childNodes[0].rawText);
        stats.hpRegLv1 = rawTextToNumber(hpRegTds[1].childNodes[0].rawText);
        stats.hpRegLv15 = rawTextToNumber(hpRegTds[2].childNodes[0].rawText);
        stats.hpRegLv25 = rawTextToNumber(hpRegTds[3].childNodes[0].rawText);
        stats.hpRegLv30 = rawTextToNumber(hpRegTds[4].childNodes[0].rawText);
        const magicResistTds = inTrs[3].childNodes.filter(elem => elem.tagName === 'td');
        stats.magicResistLv0 = rawTextToNumber(magicResistTds[0].childNodes[0].rawText);
        stats.magicResistLv1 = rawTextToNumber(magicResistTds[1].childNodes[0].rawText);
        stats.magicResistLv15 = rawTextToNumber(magicResistTds[2].childNodes[0].rawText);
        stats.magicResistLv25 = rawTextToNumber(magicResistTds[3].childNodes[0].rawText);
        stats.magicResistLv30 = rawTextToNumber(magicResistTds[4].childNodes[0].rawText);
        const mpTds = inTrs[4].childNodes.filter(elem => elem.tagName === 'td');
        stats.mpLv0 = rawTextToNumber(mpTds[0].childNodes[0].rawText);
        stats.mpLv1 = rawTextToNumber(mpTds[1].childNodes[0].rawText);
        stats.mpLv15 = rawTextToNumber(mpTds[2].childNodes[0].rawText);
        stats.mpLv25 = rawTextToNumber(mpTds[3].childNodes[0].rawText);
        stats.mpLv30 = rawTextToNumber(mpTds[4].childNodes[0].rawText);
        const mpRegTds = inTrs[5].childNodes.filter(elem => elem.tagName === 'td');
        stats.mpRegLv0 = rawTextToNumber(mpRegTds[0].childNodes[0].rawText);
        // console.log(mpRegTds[0].childNodes[0].rawText.trim().length);
        // console.log(stats.mpRegLv0, typeof stats.mpRegLv0, stats.mpRegLv0.length);
        stats.mpRegLv1 = rawTextToNumber(mpRegTds[1].childNodes[0].rawText);
        stats.mpRegLv15 = rawTextToNumber(mpRegTds[2].childNodes[0].rawText);
        stats.mpRegLv25 = rawTextToNumber(mpRegTds[3].childNodes[0].rawText);
        stats.mpRegLv30 = rawTextToNumber(mpRegTds[4].childNodes[0].rawText);
        const spellDmgTds = inTrs[6].childNodes.filter(elem => elem.tagName === 'td');
        stats.spellDmgLv0 = rawTextToNumber(spellDmgTds[0].childNodes[0].rawText);
        stats.spellDmgLv1 = rawTextToNumber(spellDmgTds[1].childNodes[0].rawText);
        stats.spellDmgLv15 = rawTextToNumber(spellDmgTds[2].childNodes[0].rawText);
        stats.spellDmgLv25 = rawTextToNumber(spellDmgTds[3].childNodes[0].rawText);
        stats.spellDmgLv30 = rawTextToNumber(spellDmgTds[4].childNodes[0].rawText);
        const armorTds = inTrs[7].childNodes.filter(elem => elem.tagName === 'td');
        stats.armorLv0 = rawTextToNumber(armorTds[0].childNodes[0].rawText);
        stats.armorLv1 = rawTextToNumber(armorTds[1].childNodes[0].rawText);
        stats.armorLv15 = rawTextToNumber(armorTds[2].childNodes[0].rawText);
        stats.armorLv25 = rawTextToNumber(armorTds[3].childNodes[0].rawText);
        stats.armorLv30 = rawTextToNumber(armorTds[4].childNodes[0].rawText);
        const attsPerSecTds = inTrs[8].childNodes.filter(elem => elem.tagName === 'td');
        stats.attsPerSecLv0 = rawTextToNumber(attsPerSecTds[0].childNodes[0].rawText);
        stats.attsPerSecLv1 = rawTextToNumber(attsPerSecTds[1].childNodes[0].rawText);
        stats.attsPerSecLv15 = rawTextToNumber(attsPerSecTds[2].childNodes[0].rawText);
        stats.attsPerSecLv25 = rawTextToNumber(attsPerSecTds[3].childNodes[0].rawText);
        stats.attsPerSecLv30 = rawTextToNumber(attsPerSecTds[4].childNodes[0].rawText);
        const msAmpTds = inTrs[9].childNodes.filter(elem => elem.tagName === 'td');
        stats.msAmpLv0 = rawTextToNumber(msAmpTds[0].childNodes[0].rawText);
        stats.msAmpLv1 = rawTextToNumber(msAmpTds[1].childNodes[0].rawText);
        stats.msAmpLv15 = rawTextToNumber(msAmpTds[2].childNodes[0].rawText);
        stats.msAmpLv25 = rawTextToNumber(msAmpTds[3].childNodes[0].rawText);
        stats.msAmpLv30 = rawTextToNumber(msAmpTds[4].childNodes[0].rawText);
        const dmgTds = inTrs[10].childNodes.filter(elem => elem.tagName === 'td');
        stats.dmgLv0 = dmgTds[0].childNodes[0].rawText.slice(0, dmgTds[0].childNodes[0].rawText.length - 1);
        stats.dmgLv1 = dmgTds[1].childNodes[0].rawText.slice(0, dmgTds[1].childNodes[0].rawText.length - 1);
        stats.dmgLv15 = dmgTds[2].childNodes[0].rawText.slice(0, dmgTds[2].childNodes[0].rawText.length - 1);
        stats.dmgLv25 = dmgTds[3].childNodes[0].rawText.slice(0, dmgTds[3].childNodes[0].rawText.length - 1);
        stats.dmgLv30 = dmgTds[4].childNodes[0].rawText.slice(0, dmgTds[4].childNodes[0].rawText.length - 1);


        const inTbody2 = trs[2].childNodes.find(elem => elem.tagName === 'td').childNodes.find(elem => elem.tagName === 'table').childNodes.find(elem => elem.tagName === 'tbody');
        const inTrs2 = inTbody2.childNodes.filter(elem => elem.tagName === 'tr');
        const baseStats = {};
        baseStats.ms = rawTextToNumber(inTrs2[0].childNodes.find(elem => elem.tagName === 'td').childNodes[0].rawText);
        baseStats.as = rawTextToNumber(inTrs2[1].childNodes.find(elem => elem.tagName === 'td').childNodes[0].rawText);
        baseStats.turnRate = rawTextToNumber(inTrs2[2].childNodes.find(elem => elem.tagName === 'td').childNodes[0].rawText);
        const visionRanges = inTrs2[3].childNodes.find(elem => elem.tagName === 'td').childNodes.filter(elem => elem.tagName === 'span').map(elem => elem.childNodes[0].rawText).map(elem => rawTextToNumber(elem));
        baseStats.visionRange = { day: visionRanges[0], night: visionRanges[1] };
        baseStats.attackRange = rawTextToNumber(inTrs2[4].childNodes.find(elem => elem.tagName === 'td').childNodes[0].rawText);
        baseStats.projectileSpeed = rawTextToNumber(inTrs2[5].childNodes.find(elem => elem.tagName === 'td').childNodes[0].rawText);
        const atackAnimations = inTrs2[6].childNodes.find(elem => elem.tagName === 'td').childNodes.filter(elem => elem.tagName === 'span').map(elem => elem.childNodes[0].rawText).map(elem => rawTextToNumber(elem));
        baseStats.attackAnimation = { point: atackAnimations[0], backswing: !isNaN(Number(atackAnimations[1])) ? Number(atackAnimations[1]) : null };
        baseStats.baseAttackTime = rawTextToNumber(inTrs2[7].childNodes.find(elem => elem.tagName === 'td').childNodes[0].rawText);
        baseStats.dmgBlock = rawTextToNumber(inTrs2[8].childNodes.find(elem => elem.tagName === 'td').childNodes[0].rawText);
        baseStats.collisionSize = rawTextToNumber(inTrs2[9].childNodes.find(elem => elem.tagName === 'td').childNodes[0].rawText);
        baseStats.legs = rawTextToNumber(inTrs2[10].childNodes.find(elem => elem.tagName === 'td').rawText.split('&')[0].trim());

        return { stats, baseStats, name };
    })
}



exported.getHeroData = (heroName) => {
    let description = '';
    let range = '';
    let mainAttribute = '';
    let heroNameForURL = heroName.replace(/\s/g, '_');
    return axios.get(`https://dota2.gamepedia.com/${heroNameForURL}`).then(response => response.data).then(data => {
        const root = parse(data);
        const content = root.querySelector('#mw-content-text').childNodes[0];
        const descriptionTag = content.childNodes.find(elem => elem.tagName === 'p');
        descriptionTag.childNodes.forEach(childNode => description += childNode.rawText);
        const rangeAndMainAttr = descriptionTag.childNodes.filter(childNode => childNode.tagName === 'a').slice(0, 2);
        try {
            range = rangeAndMainAttr[0].childNodes[0].rawText;
            mainAttribute = rangeAndMainAttr[1].childNodes[0].rawText;
        } catch (err) {
            console.log('ERROR WHEN GETTING RANGE/MAIN ATTRIBUTE FOR HERO ' + heroName)
        }
        const rawNames = root.querySelector('#heroBio').childNodes.filter(node => node.tagName === 'div')[0].childNodes.find(node => node.tagName === 'span').rawText;
        const name = rawNames.split(',')[0];
        const nickname = rawNames.split(',').length > 1 ? rawNames.split(',')[1].trim() : null;

        // const tbody = content.childNodes[2].childNodes[1];
        const tbody = root.querySelector('.infobox').childNodes.find(elem => elem.tagName === 'tbody');
        const trs = tbody.childNodes.filter(elem => elem.tagName === 'tr');
        let imgMedium = null;
        try {
            imgMedium = trs[0].childNodes.find(elem => elem.tagName === 'th')
                .childNodes.filter(elem => elem.tagName === 'div')[0].childNodes[0].childNodes[0].getAttribute('src');
        } catch (err) {
            console.log('ERROR WHEN GETTING IMGMEDIUM FOR HERO ' + heroName);
        }

        const audio = root.querySelector('#heroBio').childNodes.filter(node => node.tagName === 'div')[1].childNodes.find(elem => elem.tagName === 'span').childNodes[0].childNodes[0].getAttribute('src');
        const lore = root.querySelector('#heroBio').childNodes.filter(node => node.tagName === 'div')[2].childNodes.filter(elem => elem.tagName === 'div')[0].childNodes.filter(elem => elem.tagName === 'div')[1].rawText;

        return { range, mainAttribute, description, name, nickname, imgMedium, bio: { audio, lore } };
    })
}

module.exports = exported;