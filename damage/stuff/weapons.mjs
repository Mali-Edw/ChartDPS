import { one_to_max } from "../input.mjs";

//Calcs Damage per Attack , toggle in INPUT to roll 0-max or 1-max
const damagePerAttack = (maxHit, hitChance) => {
  if (one_to_max) {
    return ((maxHit + 1) * hitChance) / 2;
  }
  return (maxHit * hitChance) / 2;
};

//Calculates accuracy
export const hitChance = (attackRoll, defenceRoll) => {
  if (attackRoll > defenceRoll) {
    let chance = 1 - (defenceRoll + 2) / (2 * (attackRoll + 1));
    return chance;
  }
  let chance = attackRoll / (2 * (defenceRoll + 1));
  return chance;
};

export const weapon = {
  scythe: {
    slashAttack: 125,
    stabAttack: 0,
    crushAttack: 30,
    strengthBonus: 75,
    speed: 5,
    slash: true,
    attack: function (maxHit, attackRoll, defenceRoll, size = 3) {
      let accuracy = hitChance(attackRoll, defenceRoll);
      const firstHit = maxHit;
      const secondHit = Math.floor(firstHit / 2);
      const thirdHit = Math.floor(secondHit / 2);
      let totalDamage = 0;
      totalDamage += damagePerAttack(firstHit, accuracy);
      totalDamage += damagePerAttack(secondHit, accuracy);
      if (size > 2) {
        totalDamage += damagePerAttack(thirdHit, accuracy);
      }
      return totalDamage;
    },
  },
  dragonClaws: {
    stabAttack: 41,
    slashAttack: 57,
    strengthBonus: 56,
    speed: 4,
    slash: true,
    attack: function (maxHit, attackRoll, defenceRoll) {
      let accuracy = hitChance(attackRoll, defenceRoll);
      return damagePerAttack(maxHit, accuracy);
    },
    specialAttack: function (maxHit, attackRoll, defenceRoll) {
      function shinkshink() {
        let accuracy = hitChance(attackRoll, defenceRoll);
        let max = maxHit;
        let totalDamage = 0;
        if (Math.random() < accuracy) {
          let newMax = max - 1;
          let minHit = Math.floor(max / 2);
          let firstHit =
            Math.floor(Math.random() * (newMax - minHit + 1)) + minHit;
          let secondHit = Math.floor(firstHit / 2);
          let thirdHit = Math.floor(secondHit / 2);
          let fourthHit = thirdHit;
          if (Math.random() < 0.5) {
            fourthHit++;
          }
          totalDamage = firstHit + secondHit + thirdHit + fourthHit;
        }
        if (totalDamage === 0 && Math.random() < accuracy) {
          let newMax = Math.floor((maxHit * 7) / 8);
          let minHit = Math.floor((maxHit * 3) / 8);
          let firstHit = 0;
          let secondHit =
            Math.floor(Math.random() * (newMax - minHit + 1)) + minHit;
          let thirdHit = Math.floor(secondHit / 2);
          let fourthHit = thirdHit;
          if (Math.random() < 0.5) {
            fourthHit++;
          }
          totalDamage = firstHit + secondHit + thirdHit + fourthHit;
        }
        if (totalDamage === 0 && Math.random() < accuracy) {
          let newMax = Math.floor((maxHit * 3) / 4);
          let minHit = Math.floor((maxHit * 1) / 4);
          let firstHit = 0;
          let secondHit = 0;
          let thirdHit = Math.floor(
            Math.random() * (newMax - minHit + 1) + minHit
          );
          let fourthHit = thirdHit;
          if (Math.random() < 0.5) {
            fourthHit++;
          }
          totalDamage = firstHit + secondHit + thirdHit + fourthHit;
        }
        if (totalDamage === 0 && Math.random() < accuracy) {
          let newMax = Math.floor((maxHit / 4) * 5);
          let minHit = Math.floor(maxHit / 4);
          let firstHit = 0;
          let secondHit = 0;
          let thirdHit = 0;
          let fourthHit = Math.floor(
            Math.random() * (newMax - minHit + 1) + minHit
          );
          if (Math.random() < 0.5) {
            fourthHit++;
          }
          totalDamage = firstHit + secondHit + thirdHit + fourthHit;
        }
        if (totalDamage === 0 && Math.random() < 2 / 3) {
          totalDamage += 2;
        }
        return totalDamage;
      }
      let damage = 0;
      let sims = 1000000;
      for (let i = 0; i < sims; i++) {
        damage += shinkshink();
      }
      return damage / sims;
    },
  },
  crystalHalberd: {
    stabAttack: 85,
    crushAttack: 0,
    slashAttack: 110,
    strengthBonus: 118,
    speed: 7,
    slash: true,
    specialAttack: function (maxHit, attackRoll, defenceRoll) {
      let accuracy1 = hitChance(attackRoll, defenceRoll);
      let accuracy2 = hitChance(Math.floor(attackRoll * 0.75), defenceRoll);
      let totalDamage = 0;
      let max = Math.floor(maxHit * 1.1);
      totalDamage += damagePerAttack(max, accuracy1);
      totalDamage += damagePerAttack(max, accuracy2);
      return totalDamage;
    },
  },
  dragonWarhammer: {
    stabAttack: 0,
    slashAttack: 0,
    crushAttack: 95,
    strengthBonus: 85,
    speed: 6,
    oneHand: true,
    dwh: true,
    crush: true,
    specialAttack: function (maxHit, attackRoll, defenceRoll) {
      let max = Math.floor(maxHit * 1.5);
      let accuracy = hitChance(attackRoll, defenceRoll);
      let totalDamage = damagePerAttack(max, accuracy);
      return totalDamage;
    },
  },
  bandosGodsword: {
    stabAttack: 0,
    slashAttack: 132,
    crushAttack: 80,
    strengthBonus: 132,
    speed: 6,
    slash: true,
    specialAttack: function (maxHit, attackRoll, defenceRoll) {
      let max = Math.floor(maxHit * 1.21);
      let accuracy = hitChance(attackRoll * 2, defenceRoll);
      let totalDamage = damagePerAttack(max, accuracy);
      return totalDamage;
    },
  },
  dinhsBulwark: {
    stabAttack: 0,
    slashAttack: 0,
    crushAttack: 124,
    strengthBonus: 38,
    speed: 5,
    dinhs: true,
    crush: true,
    specialAttack: function (maxHit, attackRoll, defenceRoll) {
      let max = maxHit;
      let accuracy = hitChance(Math.floor(attackRoll * 1.2), defenceRoll);
      let totalDamage = damagePerAttack(max, accuracy);
      return totalDamage;
    },
  },
  abyssalTentacle: {
    stabAttack: 0,
    slashAttack: 90,
    crushAttack: 0,
    strengthBonus: 86,
    speed: 4,
    oneHand: true,
    slash: true,
    attack: function (maxHit, attackRoll, defenceRoll) {
      let accuracy = hitChance(attackRoll, defenceRoll);
      return damagePerAttack(maxHit, accuracy);
    },
  },
  bladeOfSaeldor: {
    stabAttack: 55,
    slashAttack: 94,
    crushAttack: 0,
    strengthBonus: 89,
    speed: 4,
    oneHand: true,
    controlled: true,
    slash: true,
    attack: function (maxHit, attackRoll, defenceRoll) {
      let accuracy = hitChance(attackRoll, defenceRoll);
      return damagePerAttack(maxHit, accuracy);
    },
  },
  swiftBlade: {
    slashAttack: 0,
    stabAttack: 0,
    crushAttack: 0,
    strengthBonus: 0,
    speed: 3,
    oneHand: true,
    slash: true,
    attack: function (maxHit, attackRoll, defenceRoll) {
      let accuracy = hitChance(attackRoll, defenceRoll);
      return damagePerAttack(maxHit, accuracy);
    },
  },
};

//dropdown menu for dinhs dps to select number of crabs hit
//redcrab dps if 2 or 3 hitsplats instead of 100%d, 50%d, 0%d for scythe
