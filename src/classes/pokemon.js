import Attack from 'classes/attack';
import { TYPES, isEffective, isNotVeryEffective } from 'classes/types';

const STAB_MULTIPLE = 1.25;
const EFFECTIVE_MULTIPLE = 1.5;
const NOT_VERY_EFFECTIVE_MULTIPLE = 0.5;

export default class Pokemon {
  static POKEMON_IDS = {
    PIKACHU: 'pikachu',
    CHARMANDER: 'charmander',
  }

  static pokemonTemplatesById = {
    [this.POKEMON_IDS.PIKACHU]: {
      id: this.POKEMON_IDS.PIKACHU,
      name: 'Pikachu',
      hp: 100,
      type: TYPES.ELECTRIC,
      attackIds: [
        Attack.ATTACK_IDS.THUNDER_SHOCK,
        Attack.ATTACK_IDS.QUICK_ATTACK,
      ]
    },
    [this.POKEMON_IDS.CHARMANDER]: {
      id: this.POKEMON_IDS.CHARMANDER,
      name: 'Charmander',
      hp: 100,
      type: TYPES.FIRE,
      attackIds: [
        Attack.ATTACK_IDS.FLAMETHROWER,
        Attack.ATTACK_IDS.SCRATCH,
      ]
    },
  }

  static createFromId(id) {
    return new Pokemon(this.pokemonTemplatesById[id]);
  }

  constructor({id, name, type, hp, attackIds}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.hp = hp;
    this.attackMap = attackIds.reduce((attackMap, attackId) => {
      return attackMap.set(attackId, Attack.createFromId(attackId));
    }, new Map());
  }

  attackPokemon(attackId, rivalPokemon) {
    const attack = this.attackMap.get(attackId);
    if (!attack) {
      throw new Error(`Pokemon does not have attack with id ${attackId}`);
    }

    let attackerModifiedDamage = attack.baseDamage;

    // STAB damage
    if (this.type === attack.type) {
      attackerModifiedDamage *= STAB_MULTIPLE;
    }

    rivalPokemon.receiveAttack(attack, attackerModifiedDamage);
  }

  receiveAttack(attack, attackerModifiedDamage) {
    let netDamage = attackerModifiedDamage;
    console.log(attack.type, this.type)
    if (isEffective(attack.type, this.type)) {
      netDamage *= EFFECTIVE_MULTIPLE;
    } else if (isNotVeryEffective(attack.type, this.type)) {
      netDamage *= NOT_VERY_EFFECTIVE_MULTIPLE;
    }

    this.hp = Math.max(this.hp - netDamage, 0);
  }
}