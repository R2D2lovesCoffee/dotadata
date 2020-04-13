const Hero = require('../database/models/Hero');
const Spell = require('../database/models/Spell');
const HeroDetail = require('../database/models/HeroDetail');
const SpellSound = require('../database/models/SpellSound');

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
        ms: heroDetails.baseStats.ms,
        as: heroDetails.baseStats.as,
        turn_rate: heroDetails.baseStats.turnRate,
        vision_range_day: heroDetails.baseStats.visionRange.day,
        vision_range_night: heroDetails.baseStats.visionRange.night,
        attack_range: heroDetails.baseStats.attackRange,
        projectile_speed: heroDetails.baseStats.projectileSpeed,
        attack_animation_point: heroDetails.baseStats.attackAnimation.point,
        attack_animation_backswing: heroDetails.baseStats.attackAnimation.backswing,
        base_attack_time: heroDetails.baseStats.baseAttackTime,
        dmg_block: heroDetails.baseStats.dmgBlock,
        collision_size: heroDetails.baseStats.collisionSize,
        legs: heroDetails.baseStats.legs,
        hp_lv_0: heroDetails.stats.hpLv0,
        hp_lv_1: heroDetails.stats.hpLv1,
        hp_lv_15: heroDetails.stats.hpLv15,
        hp_lv_25: heroDetails.stats.hpLv25,
        hp_lv_30: heroDetails.stats.hpLv30,
        hp_reg_lv_0: heroDetails.stats.hpRegLv0,
        hp_reg_lv_1: heroDetails.stats.hpRegLv1,
        hp_reg_lv_15: heroDetails.stats.hpRegLv15,
        hp_reg_lv_25: heroDetails.stats.hpRegLv25,
        hp_reg_lv_30: heroDetails.stats.hpRegLv30,
        magic_resist_lv_0: heroDetails.stats.magicResistLv0,
        magic_resist_lv_1: heroDetails.stats.magicResistLv1,
        magic_resist_lv_15: heroDetails.stats.magicResistLv15,
        magic_resist_lv_25: heroDetails.stats.magicResistLv25,
        magic_resist_lv_30: heroDetails.stats.magicResistLv30,
        mp_lv_0: heroDetails.stats.mpLv0,
        mp_lv_1: heroDetails.stats.mpLv1,
        mp_lv_15: heroDetails.stats.mpLv15,
        mp_lv_25: heroDetails.stats.mpLv25,
        mp_lv_30: heroDetails.stats.mpLv30,
        mp_reg_lv_0: heroDetails.stats.mpRegLv0,
        mp_reg_lv_1: heroDetails.stats.mpRegLv1,
        mp_reg_lv_15: heroDetails.stats.mpRegLv15,
        mp_reg_lv_25: heroDetails.stats.mpRegLv25,
        mp_reg_lv_30: heroDetails.stats.mpRegLv30,
        spell_dmg_lv_0: heroDetails.stats.spellDmgLv0,
        spell_dmg_lv_1: heroDetails.stats.spellDmgLv0,
        spell_dmg_lv_15: heroDetails.stats.spellDmgLv0,
        spell_dmg_lv_25: heroDetails.stats.spellDmgLv0,
        spell_dmg_lv_30: heroDetails.stats.spellDmgLv0,
        armor_lv_0: heroDetails.stats.armorLv0,
        armor_lv_1: heroDetails.stats.armorLv1,
        armor_lv_15: heroDetails.stats.armorLv15,
        armor_lv_25: heroDetails.stats.armorLv25,
        armor_lv_30: heroDetails.stats.armorLv30,
        atts_per_sec_lv_0: heroDetails.stats.attsPerSecLv0,
        atts_per_sec_lv_1: heroDetails.stats.attsPerSecLv1,
        atts_per_sec_lv_15: heroDetails.stats.attsPerSecLv15,
        atts_per_sec_lv_25: heroDetails.stats.attsPerSecLv25,
        atts_per_sec_lv_30: heroDetails.stats.attsPerSecLv30,
        ms_amp_lv_0: heroDetails.stats.msAmpLv0,
        ms_amp_lv_1: heroDetails.stats.msAmpLv1,
        ms_amp_lv_15: heroDetails.stats.msAmpLv15,
        ms_amp_lv_25: heroDetails.stats.msAmpLv25,
        ms_amp_lv_30: heroDetails.stats.msAmpLv30,
        dmg_lv_0_min: Number(heroDetails.stats.dmgLv0.split('-')[0]),
        dmg_lv_0_max: Number(heroDetails.stats.dmgLv0.split('-')[1]),
        dmg_lv_1_min: Number(heroDetails.stats.dmgLv1.split('-')[0]),
        dmg_lv_1_max: Number(heroDetails.stats.dmgLv1.split('-')[1]),
        dmg_lv_15_min: Number(heroDetails.stats.dmgLv15.split('-')[0]),
        dmg_lv_15_max: Number(heroDetails.stats.dmgLv15.split('-')[1]),
        dmg_lv_25_min: Number(heroDetails.stats.dmgLv25.split('-')[0]),
        dmg_lv_25_max: Number(heroDetails.stats.dmgLv25.split('-')[1]),
        dmg_lv_30_min: Number(heroDetails.stats.dmgLv30.split('-')[0]),
        dmg_lv_30_max: Number(heroDetails.stats.dmgLv30.split('-')[1]),
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
        })).dataValues
        if (spell.sounds) {
            for (sound of spell.sounds) {
                await SpellSound.create({
                    spell_id: inserted.id,
                    src: sound
                })
            }
        }
    }
    console.log('finished inserting spells');
}

module.exports = fillDB;