export const TYPES = {
  ELECTRIC: 'electric',
  FIRE: 'fire',
  WATER: 'water',
  GRASS: 'grass',
  NORMAL: 'normal',
};

const typeSet = new Set(Object.values(TYPES));

const strengthMap = {
  [TYPES.ELECTRIC]: new Set([]),
  [TYPES.FIRE]: new Set([TYPES.GRASS]),
  [TYPES.WATER]: new Set([TYPES.FIRE]),
  [TYPES.GRASS]: new Set([TYPES.WATER]),
  [TYPES.NORMAL]: new Set([]),
};

const weaknessMap = {
  [TYPES.ELECTRIC]: new Set([]),
  [TYPES.FIRE]: new Set([TYPES.WATER]),
  [TYPES.WATER]: new Set([TYPES.GRASS]),
  [TYPES.GRASS]: new Set([TYPES.FIRE]),
  [TYPES.NORMAL]: new Set([]),
};

export const isNotVeryEffective = (attackType, targetPokemonType) => {
  if (
    !typeSet.has(attackType) ||
    !typeSet.has(targetPokemonType) ||
    !weaknessMap[attackType]
  ) {
    throw new Error('Type not recognized');
  }

  return weaknessMap[attackType].has(targetPokemonType);
}

export const isEffective = (attackType, targetPokemonType) => {
  if (
    !typeSet.has(attackType) ||
    !typeSet.has(targetPokemonType) ||
    !strengthMap[attackType]
  ) {
    throw new Error('Type not recognized');
  }

  return strengthMap[attackType].has(targetPokemonType);
}