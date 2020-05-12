const axios = require('axios');
const { parse } = require('node-html-parser');
const { rawTextToNumber } = require('../utils');
const { getHeroSpells } = require('./spell');

const exported = {};

exported.getAllItems = () => {
    return axios.get('https://dota2.gamepedia.com/Item_Grid').then(response => response.data).then(data => {
        const root = parse(data);
        const items = [];
        const columns = root.querySelector('#mw-content-text').childNodes.find(elem => elem.tagName === 'div').childNodes.find(elem => elem.tagName === 'table').childNodes.find(elem => elem.tagName === 'tbody')
            .childNodes.filter(elem => elem.tagName === 'tr')[1].childNodes.filter(elem => elem.tagName === 'td')
            .map(td => td.childNodes.find(elem => elem.tagName === 'ul'));
        columns.forEach(ul => {
            ul.childNodes.filter(elem => elem.tagName === 'li').forEach(li => {
                const title = li.childNodes.find(elem => elem.tagName === 'a').getAttribute('title');
                const split = title.split('(');
                const name = split[0].trim();
                const price = split[1] ? split[1].split(')')[0] : null;
                items.push({ name, price });
            })
        })
        return items;
    })
}

exported.getItem = async (name) => {
    const abilities = (await getHeroSpells(name)).map(elem => {
        const actual = {
            name: elem.name,
            interacts: elem.interacts,
            description: elem.description,
            generals: elem.generals,
            cooldown: elem.cooldown,
            mana: elem.mana,
            props: elem.props
        }
        return actual;
    })
    const url = `https://dota2.gamepedia.com/${name.replace(/\s/g, '_')}`;
    return axios.get(url).then(response => response.data).then(data => {
        const root = parse(data);
        const tbody = root.querySelector('#mw-content-text').childNodes.find(elem => elem.tagName === 'div').childNodes.find(elem => elem.tagName === 'table').childNodes.find(elem => elem.tagName === 'tbody');
        const trs = tbody.childNodes.filter(elem => elem.tagName === 'tr');
        const img = trs[1].childNodes.find(elem => elem.tagName === 'td').childNodes.find(elem => elem.tagName === 'a').childNodes.find(elem => elem.tagName === 'img').getAttribute('src');
        const lore = trs[2].childNodes.find(elem => elem.tagName === 'td') ? trs[2].childNodes.find(elem => elem.tagName === 'td').rawText.trim() : null;
        const detailTrs = trs[trs.length - 1].childNodes.find(elem => elem.tagName === 'td').childNodes.find(elem => elem.tagName === 'table').childNodes.find(elem => elem.tagName === 'tbody').childNodes.filter(elem => elem.tagName === 'tr');
        const bonusTr = detailTrs.find(elem => {
            const th = elem.childNodes.find(elem => elem.tagName === 'th');
            if (th) {
                return th.rawText.trim() === 'Bonus';
            }
        });
        let bonus = null;
        if (bonusTr) {
            bonus = '';
            bonusTr.childNodes.find(elem => elem.tagName === 'td').childNodes.forEach(node => {
                bonus += node.rawText;
                if (node.tagName === 'br') {
                    bonus += '\n';
                }
            });
            bonus = bonus.trim();
        }
        const recipe = detailTrs[detailTrs.length - 1].childNodes.find(elem => elem.tagName === 'td');
        let components = null;
        let usedIn = null;
        const imgComponentsOrUsedIn = recipe.childNodes.find(elem => elem.tagName === 'img');
        if (imgComponentsOrUsedIn) {
            if (imgComponentsOrUsedIn.getAttribute('alt').includes('Components')) {
                components = recipe.childNodes.find(elem => elem.tagName === 'div').childNodes.find(elem => elem.tagName === 'div').childNodes.filter(elem => elem.tagName === 'div').map(div => div.childNodes.find(elem => elem.tagName === 'a').getAttribute('href').split('/')[1].replace(/_/g, ' '));
            } else {
                usedIn = recipe.childNodes.find(elem => elem.tagName === 'div').childNodes.find(elem => elem.tagName === 'div').childNodes.filter(elem => elem.tagName === 'div').map(div => div.childNodes.find(elem => elem.tagName === 'a').getAttribute('href').split('/')[1].replace(/_/g, ' '));
            }
        }
        return { name, components, usedIn, bonus, img, lore, abilities };
    })
}

module.exports = exported;