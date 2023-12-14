import * as equipment from "./stuff/equipment.mjs";
import * as boosts from "./stuff/boosts.mjs";

//def values decriment by this amount. Range is 1-25
export const decriment = 10;

//select equipment
const helm = equipment.helmet.torva;
const chest = equipment.chest.torva;
const legs = equipment.legs.torva;
const necklace = equipment.necklace.torture;
const boots = equipment.boots.primordial;
const gloves = equipment.gloves.ferocious;
const cape = equipment.cape.infernal;
const ring = equipment.ring.ultor;
const offhand = equipment.offhand.avernic;
//elite void = true / false | true replaces appropriate gear
const eliteVoid = false;

//accurate attack style = true / false
const accurate = false;

//damage rolls 1-max instead of 0-max | does not worth with claw spec
export const one_to_max = true;

//select prayers + potion
const prayer = boosts.prayer.piety;
const potion = boosts.potion.supercombat;

//select stats
const attackLevel = 99;
const strengthLevel = 99;

export const player = {
  gear: {
    helm: eliteVoid ? equipment.helmet.eliteVoid : helm,
    chest: eliteVoid ? equipment.chest.eliteVoid : chest,
    legs: eliteVoid ? equipment.legs.eliteVoid : legs,
    necklace: necklace,
    boots: boots,
    gloves: eliteVoid ? equipment.gloves.eliteVoid : gloves,
    cape: cape,
    ring: ring,
    offhand: offhand,
  },

  stats: {
    attack: attackLevel,
    strength: strengthLevel,
  },

  boosts: {
    prayer: prayer,
    potion: potion,
  },

  eliteVoid: eliteVoid,
  accurate: accurate,
};
