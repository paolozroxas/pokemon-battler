import Pokemon from 'classes/pokemon';
import Attack from 'classes/attack';
import { TYPES } from 'classes/types';

describe('pokemon object', () => {
  describe('createFromId', () => {
    it('successfully creates a pokemon from id', () => {
      const pikachu = Pokemon.createFromId(Pokemon.POKEMON_IDS.PIKACHU);
      expect(pikachu).toMatchObject({
        id: Pokemon.POKEMON_IDS.PIKACHU,
        name: 'Pikachu',
        type: TYPES.ELECTRIC,
      })
    })
  });
  describe('attack pokemon', () => {
    describe('with a regular attack', () => {
      it('correctly calculates the health of the rival pokemon', () => {
        const playerPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.PIKACHU);
        const rivalPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.CHARMANDER);
        
        const { netDamage, effectiveness } = playerPokemon.attackPokemon(Attack.ATTACK_IDS.QUICK_ATTACK, rivalPokemon);
  
        expect(netDamage).toBe(30);
        expect(effectiveness).toBeNull();
      });
    });
    describe('with STAB damage', () => {
      it('correctly calculates the health of the rival pokemon', () => {
        const playerPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.PIKACHU);
        const rivalPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.CHARMANDER);
        
        const { netDamage, effectiveness } = playerPokemon.attackPokemon(Attack.ATTACK_IDS.THUNDER_SHOCK, rivalPokemon);
  
        expect(netDamage).toBe(50);
        expect(effectiveness).toBeNull();
      });
    });
    describe('with a super effective attack', () => {
      it.skip('correctly calculates the health of the rival pokemon', () => {});
    });
    describe('with a not very effective attack', () => {
      it.skip('correctly calculates the health of the rival pokemon', () => {});
    });
  })
})