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
      it('correctly subtracts the health of the rival pokemon', () => {
        const playerPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.PIKACHU);
        const rivalPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.CHARMANDER);
  
        expect(rivalPokemon.hp).toBe(100);
        
        playerPokemon.attackPokemon(Attack.ATTACK_IDS.QUICK_ATTACK, rivalPokemon);
  
        expect(rivalPokemon.hp).toBe(70);
      });
    });
    describe('with attack damage greater than rival pokemon HP', () => {
      it('does not lower pokemon HP below zero', () => {
        const playerPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.PIKACHU);
        const rivalPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.CHARMANDER);
        rivalPokemon.hp = 1;
  
        expect(rivalPokemon.hp).toBe(1);
        
        playerPokemon.attackPokemon(Attack.ATTACK_IDS.QUICK_ATTACK, rivalPokemon);
  
        expect(rivalPokemon.hp).toBe(0);
      })
    })
    describe('with STAB damage', () => {
      it('correctly subtracts the health of the rival pokemon', () => {
        const playerPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.PIKACHU);
        const rivalPokemon = Pokemon.createFromId(Pokemon.POKEMON_IDS.CHARMANDER);
  
        expect(rivalPokemon.hp).toBe(100);
        
        playerPokemon.attackPokemon(Attack.ATTACK_IDS.THUNDER_SHOCK, rivalPokemon);
  
        expect(rivalPokemon.hp).toBe(50);
      });
    });
    describe('with a super effective attack', () => {
      it.skip('correctly subtracts the health of the rival pokemon', () => {});
    });
    describe('with a not very effective attack', () => {
      it.skip('correctly subtracts the health of the rival pokemon', () => {});
    });
  })
})