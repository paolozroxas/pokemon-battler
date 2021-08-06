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

  attackPokemon(attackId, defenderPokemon) {
    const attack = this.attackMap.get(attackId);
    if (!attack) {
      throw new Error(`Pokemon does not have attack with id ${attackId}`);
    }

    let attackerDamageModifier = 1;
    // STAB damage
    if (this.type === attack.type) {
      attackerDamageModifier *= STAB_MULTIPLE;
    }

    const { defenderDamageModifier, effectiveness } = defenderPokemon.receiveAttack(attack);
    return {
      netDamage: attack.baseDamage * attackerDamageModifier * defenderDamageModifier,
      effectiveness,
    };
  }

  receiveAttack(attack) {
    let defenderDamageModifier = 1;
    let effectiveness = null;
    if (isEffective(attack.type, this.type)) {
      defenderDamageModifier *= EFFECTIVE_MULTIPLE;
      effectiveness = Attack.EFFECTIVENESS.SUPER_EFFECTIVE;
    } else if (isNotVeryEffective(attack.type, this.type)) {
      defenderDamageModifier *= NOT_VERY_EFFECTIVE_MULTIPLE;
      effectiveness = Attack.EFFECTIVENESS.NOT_VERY_EFFECTIVE;
    }

    return {
      defenderDamageModifier,
      effectiveness,
    };
  }

  getAttackOptions() {
    const attackInfo = [];
    this.attackMap.forEach(attack => {
      attackInfo.push({ id: attack.id, name: attack.name });
    })
    return attackInfo;
  }

  getPokemonState() {
    return {
      name: this.name,
      hp: this.hp,
    };
  }
}