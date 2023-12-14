import { player, decriment } from "../input.mjs";
import { weapon } from "./weapons.mjs";
import { targets } from "./targets.mjs";

//Calculate effective attck & strength level based on prayer + pots
const effective_Attack_and_Strength = (player, weapon = {}) => {
  let eliteVoid = player.eliteVoid;
  let accurate = player.accurate;

  let attack = player.stats.attack;
  let strength = player.stats.strength;
  let pottedStats = player.boosts.potion(attack, strength);
  let newAttack = Math.floor(pottedStats[0] * player.boosts.prayer.attack);
  let newStrength = Math.floor(pottedStats[1] * player.boosts.prayer.strength);

  if (weapon.hasOwnProperty("dinhs") || weapon.hasOwnProperty("dwh")) {
    accurate = true;
  }

  if (weapon.hasOwnProperty("controlled") && !accurate) {
    newAttack++;
    newStrength++;
  } else if (accurate) {
    newAttack += 11;
    newStrength += 8;
  } else {
    newAttack += 8;
    newStrength += 11;
  }

  if (eliteVoid) {
    let voidAttack = Math.floor(newAttack * 1.1);
    let voidStrength = Math.floor(newAttack * 1.1);
    return [voidAttack, voidStrength];
  }

  return [newAttack, newStrength];
};

//Calculates Max Hit
export const maxHit = (effectiveStrength, equipmentStrength, salve = false) => {
  if (salve) {
    let max = Math.floor(
      (effectiveStrength * (equipmentStrength + 64) + 320) / 640
    );
    let newMax = Math.floor(max * 1.2);
    return newMax;
  }

  let max = Math.floor(
    (effectiveStrength * (equipmentStrength + 64) + 320) / 640
  );
  return max;
};

//Calculates Max Attack Roll
export const attackRoll = (effectiveAttack, equipmentAttack, salve = false) => {
  if (salve) {
    let newEquiptmentAttack = (equipmentAttack + 64) * 1.2;
    let atkRoll = Math.floor(effectiveAttack * newEquiptmentAttack);
    return atkRoll;
  }

  let atkRoll = Math.floor(effectiveAttack * (equipmentAttack + 64));
  return atkRoll;
};

//Calculates target Defence Roll
export const defenceRoll = (targetDefenceLevel, targetStyleBonus) => {
  return (targetDefenceLevel + 9) * (targetStyleBonus + 64);
};

//Calculates Damage per Second
export const damagePerSecond = (averageAttack, speed) => {
  return (averageAttack / (speed * 0.6)).toFixed(4);
};

//Get the total gear stats of the selected gear (no weapon)
export const combineGearStats = (player) => {
  return Object.values(player.gear).reduce((combinedStats, gearStats) => {
    Object.entries(gearStats).forEach(([key, value]) => {
      combinedStats[key] = (combinedStats[key] || 0) + value;
    });
    return combinedStats;
  }, {});
};

//Remove or Add an item from the total stats
export const modifyStats = (
  player,
  gearToSubtract = {},
  gearToAddBack = {}
) => {
  const combinedStats = combineGearStats(player);

  Object.entries(gearToSubtract).forEach(([gearItem, gearStats]) => {
    Object.entries(gearStats).forEach(([key, value]) => {
      combinedStats[key] -= value;
    });
  });

  Object.entries(gearToAddBack).forEach(([gearItem, gearStats]) => {
    Object.entries(gearStats).forEach(([key, value]) => {
      combinedStats[key] += value;
    });
  });

  return combinedStats;
};

//Formula for bonus strength on Dinh's
const bonusStrength = (gear) => {
  let dinhsDefence = 106 + 109 + 109 + 148;
  let gearDefence =
    gear.stabDefence +
    gear.slashDefence +
    gear.crushDefence +
    gear.rangedDefence;
  let totalDefence = dinhsDefence + gearDefence;
  let extraStrength = Math.floor((totalDefence / 4 - 200) / 3 - 38);
  return extraStrength;
};

//Use for slash weapons, gets Eff. Levels , Gear Bonuses , wep. Speed
const getSlashStats = (weapon, player) => {
  const effectiveAttackLevel = effective_Attack_and_Strength(player)[0];
  const effectiveStrengthLevel = effective_Attack_and_Strength(player)[1];
  let gear_attBonus = 0;
  let gear_strBonus = 0;
  let salve_attBonus = 0;
  let salve_strBonus = 0;

  if (weapon.hasOwnProperty("oneHand")) {
    const gear = modifyStats(player);
    gear_attBonus = gear.slashAttack + weapon.slashAttack;
    gear_strBonus = gear.strengthBonus + weapon.strengthBonus;

    const salve = modifyStats(player, { necklace: player.gear.necklace });
    salve_attBonus = salve.slashAttack + weapon.slashAttack;
    salve_strBonus = salve.strengthBonus + weapon.strengthBonus;
  } else {
    const gear = modifyStats(player, { offhand: player.gear.offhand });
    gear_attBonus = gear.slashAttack + weapon.slashAttack;
    gear_strBonus = gear.strengthBonus + weapon.strengthBonus;

    const salve = modifyStats(player, {
      offhand: player.gear.offhand,
      necklace: player.gear.necklace,
    });
    salve_attBonus = salve.slashAttack + weapon.slashAttack;
    salve_strBonus = salve.strengthBonus + weapon.strengthBonus;
  }

  const info = {
    noSalve: {
      attackBonus: gear_attBonus,
      strengthBonus: gear_strBonus,
    },
    salve: {
      attackBonus: salve_attBonus,
      strengthBonus: salve_strBonus,
    },
    level: {
      attack: effectiveAttackLevel,
      strength: effectiveStrengthLevel,
    },
    speed: weapon.speed,
    attack: weapon.attack,
    specialAttack: weapon.specialAttack,
  };
  return info;
};

//Use for crush weapons, gets Eff. Levels , Gear Bonuses, wep. Speed
const getCrushStats = (weapon, player) => {
  const effectiveAttackLevel = effective_Attack_and_Strength(player, weapon)[0];
  const effectiveStrengthLevel = effective_Attack_and_Strength(
    player,
    weapon
  )[1];
  let gear;
  let gear_attBonus = 0;
  let gear_strBonus = 0;
  let salve_attBonus = 0;
  let salve_strBonus = 0;

  if (weapon.hasOwnProperty("oneHand")) {
    gear = modifyStats(player);
    gear_attBonus = gear.crushAttack + weapon.crushAttack;
    gear_strBonus = gear.strengthBonus + weapon.strengthBonus;

    const salve = modifyStats(player, { necklace: player.gear.necklace });
    salve_attBonus = salve.crushAttack + weapon.crushAttack;
    salve_strBonus = salve.strengthBonus + weapon.strengthBonus;
  } else {
    gear = modifyStats(player, { offhand: player.gear.offhand });
    gear_attBonus = gear.crushAttack + weapon.crushAttack;
    gear_strBonus = gear.strengthBonus + weapon.strengthBonus;

    const salve = modifyStats(player, {
      offhand: player.gear.offhand,
      necklace: player.gear.necklace,
    });
    salve_attBonus = salve.crushAttack + weapon.crushAttack;
    salve_strBonus = salve.strengthBonus + weapon.strengthBonus;
  }
  if (weapon.hasOwnProperty("dinhs")) {
    gear_strBonus += bonusStrength(gear);
  }

  const info = {
    noSalve: {
      attackBonus: gear_attBonus,
      strengthBonus: gear_strBonus,
    },
    salve: {
      attackBonus: salve_attBonus,
      strengthBonus: salve_strBonus,
    },
    level: {
      attack: effectiveAttackLevel,
      strength: effectiveStrengthLevel,
    },
    speed: weapon.speed,
    attack: weapon.attack,
    specialAttack: weapon.specialAttack,
  };
  return info;
};

//Use for stab weapons, gets Eff. Levels & Gear Bonuses, wep. Speed
const getStabStats = (weapon, player) => {
  const effectiveAttackLevel = effective_Attack_and_Strength(player)[0];
  const effectiveStrengthLevel = effective_Attack_and_Strength(player)[1];
  let gear_attBonus = 0;
  let gear_strBonus = 0;
  let salve_attBonus = 0;
  let salve_strBonus = 0;

  if (weapon.hasOwnProperty("oneHand")) {
    const gear = modifyStats(player);
    gear_attBonus = gear.stabAttack + weapon.stabAttack;
    gear_strBonus = gear.strengthBonus + weapon.strengthBonus;

    const salve = modifyStats(player, { necklace: player.gear.necklace });
    salve_attBonus = salve.stabAttack + weapon.stabAttack;
    salve_strBonus = salve.strengthBonus + weapon.strengthBonus;
  } else {
    const gear = modifyStats(player, { offhand: player.gear.offhand });
    gear_attBonus = gear.stabAttack + weapon.stabAttack;
    gear_strBonus = gear.strengthBonus + weapon.strengthBonus;

    const salve = modifyStats(player, {
      offhand: player.gear.offhand,
      necklace: player.gear.necklace,
    });
    salve_attBonus = salve.stabAttack + weapon.stabAttack;
    salve_strBonus = salve.strengthBonus + weapon.strengthBonus;
  }

  const info = {
    noSalve: {
      attackBonus: gear_attBonus,
      strengthBonus: gear_strBonus,
    },
    salve: {
      attackBonus: salve_attBonus,
      strengthBonus: salve_strBonus,
    },
    level: {
      attack: effectiveAttackLevel,
      strength: effectiveStrengthLevel,
    },
    speed: weapon.speed,
    attack: weapon.attack,
    specialAttack: weapon.specialAttack,
  };
  return info;
};

//goes through all weapons and posts max attack rolls, max hits, weapon speed
export const getWeaponData = () => {
  const playerData = [];

  const filterUndefinedProperties = (object) => {
    const filteredData = {};

    for (const [key, value] of Object.entries(object)) {
      if (typeof value === "object" && value !== null) {
        const filteredValue = filterUndefinedProperties(value);
        if (Object.keys(filteredValue).length > 0) {
          filteredData[key] = filteredValue;
        }
      } else if (value !== undefined) {
        filteredData[key] = value;
      }
    }

    return filteredData;
  };

  Object.entries(weapon).forEach(([key, value]) => {
    if (value.slash) {
      //isolate stats
      const stats = getSlashStats(value, player);

      //max hits
      const max = maxHit(stats.level.strength, stats.noSalve.strengthBonus);
      const salveMax = maxHit(
        stats.level.strength,
        stats.salve.strengthBonus,
        true
      );

      //attack rolls
      const atkRoll = attackRoll(stats.level.attack, stats.noSalve.attackBonus);
      const salveAtkRoll = attackRoll(
        stats.level.attack,
        stats.salve.attackBonus,
        true
      );

      const weaponInfo = {
        weapon: key,
        noSalve: {
          max: max,
          atkRoll: atkRoll,
        },
        Salve: {
          max: salveMax,
          atkRoll: salveAtkRoll,
        },
        speed: stats.speed,
        attack: stats.attack,
        specialAttack: stats.specialAttack,
      };

      playerData.push({ ...weaponInfo });
    }
    if (value.crush) {
      //isolate stats
      const stats = getCrushStats(value, player);

      //max hits
      const max = maxHit(stats.level.strength, stats.noSalve.strengthBonus);
      const salveMax = maxHit(
        stats.level.strength,
        stats.salve.strengthBonus,
        true
      );

      //attack rolls
      const atkRoll = attackRoll(stats.level.attack, stats.noSalve.attackBonus);
      const salveAtkRoll = attackRoll(
        stats.level.attack,
        stats.salve.attackBonus,
        true
      );

      const weaponInfo = {
        weapon: key,
        noSalve: {
          max: max,
          atkRoll: atkRoll,
        },
        Salve: {
          max: salveMax,
          atkRoll: salveAtkRoll,
        },
        speed: stats.speed,
        attack: stats.attack,
        specialAttack: stats.specialAttack,
      };

      playerData.push({ ...weaponInfo });
    }
    if (value.stab) {
      //isolate stats
      const stats = getStabStats(value, player);

      //max hits
      const max = maxHit(stats.level.strength, stats.noSalve.strengthBonus);
      const salveMax = maxHit(
        stats.level.strength,
        stats.salve.strengthBonus,
        true
      );

      //attack rolls
      const atkRoll = attackRoll(stats.level.attack, stats.noSalve.attackBonus);
      const salveAtkRoll = attackRoll(
        stats.level.attack,
        stats.salve.attackBonus,
        true
      );

      const weaponInfo = {
        weapon: key,
        noSalve: {
          max: max,
          atkRoll: atkRoll,
        },
        Salve: {
          max: salveMax,
          atkRoll: salveAtkRoll,
        },
        speed: stats.speed,
        attack: stats.attack,
        specialAttack: stats.specialAttack,
      };

      playerData.push({ ...weaponInfo });
    }
    // console.log(playerData)
  });

  const filteredPlayerData = playerData.map((weaponInfo) =>
    filterUndefinedProperties(weaponInfo)
  );
  return filteredPlayerData;
};

//goes through all targets and posts max defense rolls for varying def values
export const getAllDefRolls = () => {
  return Object.entries(targets).map(([key, value]) => {
    let slashDef = value.slashDefence;
    let crushDef = value.crushDefence;
    let stabDef = value.stabDefence;

    let maxDef = value.defenceLevel[0];
    let minDef = value.defenceLevel[1];
    if (minDef === undefined) {
      minDef = maxDef;
    }

    let array = [];
    while (maxDef >= minDef) {
      let num = decriment;
      if (num > 25) {
        num = 25;
      }
      if (num <= 0) {
        num = 1;
      }
      array.push(maxDef);
      maxDef -= num;
    }

    const slashArray = array.map((defence) => defenceRoll(defence, slashDef));
    const crushArray = array.map((defence) => defenceRoll(defence, crushDef));
    const stabArray = array.map((defence) => defenceRoll(defence, stabDef));

    let newSlashArray = [];
    let newCrushArray = [];
    let newStabArray = [];

    for (let i = 0; i < array.length; i++) {
      newSlashArray.push([array[i], slashArray[i]]);
      newCrushArray.push([array[i], crushArray[i]]);
      newStabArray.push([array[i], stabArray[i]]);
    }

    let allDefRolls = {
      name: key,
      slash: newSlashArray,
      crush: newCrushArray,
      stab: newStabArray,
    };

    return allDefRolls;
  });
};

//gets all boss data (def level, dps, dpa) and returns it as JSON data
export const calculateAttackData = (targetIndex) => {
  const result = {};
  const target = getAllDefRolls()[targetIndex];
  const weapons = getWeaponData();

  weapons.forEach((weapon) => {
    const max = target.hasOwnProperty("Salve")
      ? weapon.Salve.max
      : weapon.noSalve.max;
    const attackRoll = target.hasOwnProperty("Salve")
      ? weapon.Salve.atkRoll
      : weapon.noSalve.atkRoll;

    const calculateDPSAndExpected = (attackFunction) => {
      if (
        !target.slash ||
        !Array.isArray(target.slash) ||
        typeof attackFunction !== "function"
      ) {
        console.error(
          "Invalid target.slash or attackFunction:",
          target.slash,
          attackFunction
        );
        return [];
      }

      return target.slash.map(([defence, accuracy]) => {
        const attackResult = attackFunction(max, attackRoll, accuracy);
        if (typeof attackResult !== "number") {
          console.error("Invalid attackResult:", attackResult);
          return {
            Defence: defence,
            DPS: 0,
            Expected: 0,
          };
        }

        return {
          Defence: defence,
          DPS: Number((attackResult / (weapon.speed * 0.6)).toFixed(4)),
          Expected: Number(attackResult.toFixed(4)),
        };
      });
    };

    if (weapon.hasOwnProperty("attack")) {
      const attackData = calculateDPSAndExpected(weapon.attack);
      result[weapon.weapon] = { attack: attackData };

      if (weapon.hasOwnProperty("specialAttack")) {
        const specialAttackData = calculateDPSAndExpected(weapon.specialAttack);
        result[weapon.weapon].specialAttack = specialAttackData;
      }
    } else if (weapon.hasOwnProperty("specialAttack")) {
      result[weapon.weapon] = {
        specialAttack: calculateDPSAndExpected(weapon.specialAttack),
      };
    }
  });

  // Remove specific weapons
  delete result.dragonWarhammer;
  delete result.bandosGodsword;
  if (targetIndex !== 7) delete result.dinhsBulwark; // Keep dinhsBulwark for redCrabData

  return JSON.stringify(result, null, 2);
};
