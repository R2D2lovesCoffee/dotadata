const Hero = require('../database/models/Hero');
const Spell = require('../database/models/Spell');
const HeroDetail = require('../database/models/HeroDetail');
const SpellSound = require('../database/models/SpellSound');
const SpellDetail = require('../database/models/SpellDetail');

const heroManager = require('../scripts/gather_info/hero');
const spellManager = require('../scripts/gather_info/spell');

const fillDB = async () => {
    const heroesWithSmallImg = await heroManager.getHeroesNameAndSmallImage();
    const heroes = await heroManager.getHeroesStats();
    heroes.splice(heroes.findIndex(elem => elem.name === 'HERO'), 1);
    const invokerIndex = heroes.findIndex(elem => elem.name === 'Invoker');
    heroes.splice(invokerIndex, 1);
    const skywrathIndex = heroes.findIndex(elem => elem.name === 'Skywrath Mage');
    heroes.splice(skywrathIndex, 1);
    const sbIndex = heroes.findIndex(elem => elem.name === 'Spirit Breaker');
    heroes.splice(sbIndex, 1); // range/main_attr problem
    for (hero of heroes) {
        try {
            hero.imgSmall = heroesWithSmallImg.find(elem => elem.name === hero.name).imgSmall;
            const hero_id = await fillHeroData(hero);
            await fillHeroDetailsData(hero, hero_id);
            await fillSpellsData(hero.name, hero_id);
        } catch (err) {
            console.log(err);
        }
    }
}

const fillHeroData = async hero => {
    console.log(`started inserting ${hero.name} data`);
    const heroData = await heroManager.getHeroData(hero.name);
    let heroToInsert = {
        name: hero.name,
        nickname: heroData.nickname,
        description: heroData.description,
        range: heroData.range,
        img_small_src: hero.imgSmall,
        img_medium_src: heroData.imgMedium,
        audio_bio_src: heroData.bio.audio,
        lore: heroData.bio.lore,
        str: hero.str,
        str_per_lv: hero.strPerLevel,
        agi: hero.agi,
        agi_per_lv: hero.agiPerLevel,
        int: hero.int,
        int_per_lv: hero.intPerLevel,
    }
    return (await Hero.create(heroToInsert)).dataValues.id;
}

const fillHeroDetailsData = async (hero, hero_id) => {
    const heroDetails = await heroManager.getHeroDetails(hero.name);
    const heroDetailsToInsert = {
        ms: heroDetails.details.ms,
        as: heroDetails.details.as,
        turn_rate: heroDetails.details.turnRate,
        vision_range_day: heroDetails.details.visionRange.day,
        vision_range_night: heroDetails.details.visionRange.night,
        attack_range: heroDetails.details.attackRange,
        projectile_speed: heroDetails.details.projectileSpeed,
        attack_animation_point: heroDetails.details.attackAnimation.point,
        attack_animation_backswing: heroDetails.details.attackAnimation.backswing,
        base_attack_time: heroDetails.details.baseAttackTime,
        dmg_block: heroDetails.details.dmgBlock,
        collision_size: heroDetails.details.collisionSize,
        legs: heroDetails.details.legs,
        hp_lv_0: heroDetails.details.hpLv0,
        hp_lv_1: heroDetails.details.hpLv1,
        hp_lv_15: heroDetails.details.hpLv15,
        hp_lv_25: heroDetails.details.hpLv25,
        hp_lv_30: heroDetails.details.hpLv30,
        hp_reg_lv_0: heroDetails.details.hpRegLv0,
        hp_reg_lv_1: heroDetails.details.hpRegLv1,
        hp_reg_lv_15: heroDetails.details.hpRegLv15,
        hp_reg_lv_25: heroDetails.details.hpRegLv25,
        hp_reg_lv_30: heroDetails.details.hpRegLv30,
        // magic_resist_lv_0: heroDetails.details.magicResistLv0,
        // magic_resist_lv_1: heroDetails.details.magicResistLv1,
        // magic_resist_lv_15: heroDetails.details.magicResistLv15,
        // magic_resist_lv_25: heroDetails.details.magicResistLv25,
        // magic_resist_lv_30: heroDetails.details.magicResistLv30,
        mp_lv_0: heroDetails.details.mpLv0,
        mp_lv_1: heroDetails.details.mpLv1,
        mp_lv_15: heroDetails.details.mpLv15,
        mp_lv_25: heroDetails.details.mpLv25,
        mp_lv_30: heroDetails.details.mpLv30,
        mp_reg_lv_0: heroDetails.details.mpRegLv0,
        mp_reg_lv_1: heroDetails.details.mpRegLv1,
        mp_reg_lv_15: heroDetails.details.mpRegLv15,
        mp_reg_lv_25: heroDetails.details.mpRegLv25,
        mp_reg_lv_30: heroDetails.details.mpRegLv30,
        // spell_dmg_lv_0: heroDetails.details.spellDmgLv0,
        // spell_dmg_lv_1: heroDetails.details.spellDmgLv0,
        // spell_dmg_lv_15: heroDetails.details.spellDmgLv0,
        // spell_dmg_lv_25: heroDetails.details.spellDmgLv0,
        // spell_dmg_lv_30: heroDetails.details.spellDmgLv0,
        armor_lv_0: heroDetails.details.armorLv0,
        armor_lv_1: heroDetails.details.armorLv1,
        armor_lv_15: heroDetails.details.armorLv15,
        armor_lv_25: heroDetails.details.armorLv25,
        armor_lv_30: heroDetails.details.armorLv30,
        atts_per_sec_lv_0: heroDetails.details.attsPerSecLv0,
        atts_per_sec_lv_1: heroDetails.details.attsPerSecLv1,
        atts_per_sec_lv_15: heroDetails.details.attsPerSecLv15,
        atts_per_sec_lv_25: heroDetails.details.attsPerSecLv25,
        atts_per_sec_lv_30: heroDetails.details.attsPerSecLv30,
        // ms_amp_lv_0: heroDetails.details.msAmpLv0,
        // ms_amp_lv_1: heroDetails.details.msAmpLv1,
        // ms_amp_lv_15: heroDetails.details.msAmpLv15,
        // ms_amp_lv_25: heroDetails.details.msAmpLv25,
        // ms_amp_lv_30: heroDetails.details.msAmpLv30,
        dmg_lv_0_min: Number(heroDetails.details.dmgLv0.split('-')[0]),
        dmg_lv_0_max: Number(heroDetails.details.dmgLv0.split('-')[1]),
        dmg_lv_1_min: Number(heroDetails.details.dmgLv1.split('-')[0]),
        dmg_lv_1_max: Number(heroDetails.details.dmgLv1.split('-')[1]),
        dmg_lv_15_min: Number(heroDetails.details.dmgLv15.split('-')[0]),
        dmg_lv_15_max: Number(heroDetails.details.dmgLv15.split('-')[1]),
        dmg_lv_25_min: Number(heroDetails.details.dmgLv25.split('-')[0]),
        dmg_lv_25_max: Number(heroDetails.details.dmgLv25.split('-')[1]),
        dmg_lv_30_min: Number(heroDetails.details.dmgLv30.split('-')[0]),
        dmg_lv_30_max: Number(heroDetails.details.dmgLv30.split('-')[1]),
    };
    return (await HeroDetail.create({ ...heroDetailsToInsert, hero_id })).dataValues.id;
}

const fillSpellsData = async (name, hero_id) => {
    console.log('inserting spells for this hero...');
    const spells = await spellManager.getHeroSpells(name);
    for (spell of spells) {
        let inserted = (await Spell.create({
            hero_id,
            name: spell.name,
            hot_key: spell.hotKey,
            legacy_key: spell.legacyKey,
            img_src: spell.img,
            description: spell.description,
            lore: spell.lore
        })).dataValues;
        if (spell.sounds) {
            for (sound of spell.sounds) {
                await SpellSound.create({
                    spell_id: inserted.id,
                    src: sound
                })
            }
        }
        for(type of ['mana', 'cooldown']) {
                await SpellDetail.create({
                    spell_id: inserted.id,
                    type,
                    default: spell[type] && spell[type].default ? spell[type].default.join('-') : null,
                    aghs: spell[type] && spell[type].aghs ? spell[type].aghs.join('-') : null,
                    talents: spell[type] && spell[type].talents ? spell[type].talents.join('-') : null,
                    both: spell[type] && spell[type].both ? spell[type].both.join('-') : null
                })
        }
    }
    console.log('finished inserting spells');
}

module.exports = fillDB;