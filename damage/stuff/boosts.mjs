//returns array , potion.potionName[attack, defence]
export const potion = 
{
    supercombat: function (attackLevel = 99, strengthLevel = 99) 
    {
        const boost = (level) =>
        {
            return (5 + Math.floor(level * 0.15)) + level;
        }
        return [boost(attackLevel), boost(strengthLevel)];
    },

    overload: function (attackLevel = 99, strengthLevel = 99) 
    {
        const boost = (level) =>
        {
            return (6 + Math.floor(level * 0.16)) + level;
        }
        return ([boost(attackLevel), boost(strengthLevel)])
    }
}

//prayer.prayerName.attack or prayer.prayerName.strength
export const prayer = 
{
    piety:
    {
        attack: 1.2,
        strength: 1.23,
    },

    chivalry:
    {
        attack: 1.15,
        strength: 1.18
    },

    15: {
        attack: 1.15,
        strength: 1.15,
    }
}