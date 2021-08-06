import Battle from 'classes/battle';
import Pokemon from 'classes/pokemon';
import Attack from 'classes/attack';

describe('battle', () => {
  describe('full battle flow', () => {
    it('changes battle state correctly at each stage of battle flow', () => {
      const battle = new Battle(Pokemon.POKEMON_IDS.PIKACHU, Pokemon.POKEMON_IDS.CHARMANDER);
      let battleState = battle.getBattleState()
      expect(battleState).toMatchObject({
        playerPokemon: { name: 'Pikachu', hp: 100 },
        rivalPokemon: { name: 'Charmander', hp: 100 },
        attackMenuOptions: [
          { id: 'thunder_shock', name: 'Thunder Shock' },
          { id: 'quick_attack', name: 'Quick Attack' }
        ],
        currentNarrationText: null,
        currentAnimation: null,
        hasGameEnded: false
      });

      // narration of player attack
      battle.handlePlayerAttack(Attack.ATTACK_IDS.THUNDER_SHOCK, 'Thunder Shock');
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: 'Pikachu used Thunder Shock!',
        currentAnimation: null,
        hasGameEnded: false
      });

      // player attack animation
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: null,
        currentAnimation: 'attack_animation_id', // TODO: finish attack animation id
        hasGameEnded: false
      });


      // rival's HP gets reduced
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        playerPokemon: { name: 'Pikachu', hp: 100 },
        rivalPokemon: { name: 'Charmander', hp: 50 },
        currentNarrationText: null,
        currentAnimation: null,
        hasGameEnded: false
      });

      // rival attack narration
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: expect.any(String),
        currentAnimation: null,
        hasGameEnded: false
      });

      // rival attack animation
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: null,
        currentAnimation: 'attack_animation_id', // TODO: finish attack animation id
        hasGameEnded: false
      });

      // player's HP gets reduced
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        playerPokemon: { name: 'Pikachu', hp: expect.any(Number) },
        rivalPokemon: { name: 'Charmander', hp: 50 },
        currentNarrationText: null,
        currentAnimation: null,
        hasGameEnded: false
      });

      // narration of player attack
      battle.handlePlayerAttack(Attack.ATTACK_IDS.THUNDER_SHOCK, 'Thunder Shock');
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: 'Pikachu used Thunder Shock!',
        currentAnimation: null,
        hasGameEnded: false
      });

      // player attack animation
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: null,
        currentAnimation: 'attack_animation_id', // TODO: finish attack animation id
        hasGameEnded: false
      });


      // rival's HP gets reduced to 0
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        playerPokemon: { name: 'Pikachu', hp: expect.any(Number) },
        rivalPokemon: { name: 'Charmander', hp: 0 },
        currentNarrationText: null,
        currentAnimation: null,
        hasGameEnded: false
      });

      // rival faints narration
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: 'Charmander fainted.',
        currentAnimation: null,
        hasGameEnded: false
      });

      // you win narration
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: 'You win!',
        currentAnimation: null,
        hasGameEnded: false
      });

      // endgame
      battle.advanceEvent();
      battleState = battle.getBattleState();
      expect(battleState).toMatchObject({
        currentNarrationText: null,
        currentAnimation: null,
        hasGameEnded: true
      });
    });
  })
});