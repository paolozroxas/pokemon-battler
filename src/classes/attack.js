import { TYPES } from 'classes/types';

export default class Attack {
  static ATTACK_IDS = {
    THUNDER_SHOCK: 'thunder_shock',
    QUICK_ATTACK: 'quick_attack',
    FLAMETHROWER: 'flamethrower',
    SCRATCH: 'scratch',
  }

  static attackTemplatesById = {
    [this.ATTACK_IDS.THUNDER_SHOCK]: {
      id: this.ATTACK_IDS.THUNDER_SHOCK,
      name: 'Thunder Shock',
      type: TYPES.ELECTRIC,
      baseDamage: 40,
    },
    [this.ATTACK_IDS.QUICK_ATTACK]: {
      id: this.ATTACK_IDS.QUICK_ATTACK,
      name: 'Quick Attack',
      type: TYPES.NORMAL,
      baseDamage: 30,
    },
    [this.ATTACK_IDS.FLAMETHROWER]: {
      id: this.ATTACK_IDS.FLAMETHROWER,
      name: 'Flamethrower',
      type: TYPES.FIRE,
      baseDamage: 45,
    },
    [this.ATTACK_IDS.SCRATCH]: {
      id: this.ATTACK_IDS.SCRATCH,
      name: 'Scratch',
      type: TYPES.NORMAL,
      baseDamage: 25,
    }
  }

  static createFromId(id) {
    return new Attack(this.attackTemplatesById[id]);
  }

  constructor({id, name, type, baseDamage}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.baseDamage = baseDamage;
  }
}