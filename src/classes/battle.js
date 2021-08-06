import Pokemon from 'classes/pokemon';
import Attack from 'classes/attack';
import _ from 'lodash';

export default class Battle {
  static EVENT_TYPES = {
    ANIMATION: 'animation',
    NARRATION: 'narration',
    HP_ADJUSTMENT: 'hp_adjustment',
    END_GAME: 'end_game',
  }
  constructor(playerPokemonId, rivalPokemonId) {
    this.playerPokemon = Pokemon.createFromId(playerPokemonId);
    this.rivalPokemon = Pokemon.createFromId(rivalPokemonId);
    this.eventQueue = [];
    this.currentNarrationText = null;
    this.currentAnimation = null;
    this.hasGameEnded = false;
  }

  getBattleState() {
    return {
      playerPokemon: this.playerPokemon.getPokemonState(),
      rivalPokemon: this.rivalPokemon.getPokemonState(),
      attackMenuOptions: this.playerPokemon.getAttackOptions(),
      currentNarrationText: this.currentNarrationText,
      currentAnimation: this.currentAnimation,
      hasGameEnded: this.hasGameEnded,
    }
  }

  advanceEvent() {
    const event = this.eventQueue.shift();
    if (!event) {
      return;
    }
    switch(event.eventType) {
      case Battle.EVENT_TYPES.ANIMATION:
        this.currentAnimation = event.animationId;
        this.currentNarrationText = null;
        break;
      case Battle.EVENT_TYPES.NARRATION:
        this.currentNarrationText = event.narrationText;
        this.currentAnimation = null;
        break;
      case Battle.EVENT_TYPES.HP_ADJUSTMENT:
        this.currentNarrationText = null;
        this.currentAnimation = null;

        if (event.hpAdjustmentTargetPokemonId === this.playerPokemon.id) {
          this.playerPokemon.hp = Math.max(0, this.playerPokemon.hp + event.hpAdjustment);
        } else if (event.hpAdjustmentTargetPokemonId === this.rivalPokemon.id) {
          this.rivalPokemon.hp = Math.max(0, this.rivalPokemon.hp + event.hpAdjustment);
        }

        if(this.playerPokemon.hp <= 0) {
          this.eventQueue.push({
            eventType: Battle.EVENT_TYPES.NARRATION,
            narrationText: `${this.playerPokemon.name} fainted.`,
          }, {
            eventType: Battle.EVENT_TYPES.NARRATION,
            narrationText: 'You lose.',
          }, {
            eventType: Battle.EVENT_TYPES.END_GAME,
          });
        } else if (this.rivalPokemon.hp <= 0) {
          this.eventQueue.push({
            eventType: Battle.EVENT_TYPES.NARRATION,
            narrationText: `${this.rivalPokemon.name} fainted.`,
          }, {
            eventType: Battle.EVENT_TYPES.NARRATION,
            narrationText: 'You win!',
          }, {
            eventType: Battle.EVENT_TYPES.END_GAME,
          });
        } else if (event.hpAdjustmentTargetPokemonId === this.rivalPokemon.id) {
          // enqueue rival attack events if player attacked and no endgame
          this.rivalAttack();
        }
        break;
      case Battle.EVENT_TYPES.END_GAME:
        this.currentNarrationText = null;
        this.currentAnimation = null;
        this.hasGameEnded = true;
        break;
      default:
        break;
    }
  }

  createAttackEvents(
    attackerPokemon,
    defenderPokemon,
    attackName,
    attackAnimationId,
    netDamage,
    effectiveness,
    ) {
    this.eventQueue.push({
      eventType: Battle.EVENT_TYPES.NARRATION,
      narrationText: `${attackerPokemon.name} used ${attackName}!`,
    }, {
      eventType: Battle.EVENT_TYPES.ANIMATION,
      animationId: attackAnimationId,
    });

    if (effectiveness === Attack.EFFECTIVENESS.SUPER_EFFECTIVE) {
      this.eventQueue.push({
        eventType: Battle.EVENT_TYPES.NARRATION,
        narrationText: "It's super effective!",
      });
    } else if (effectiveness === Attack.EFFECTIVENESS.NOT_VERY_EFFECTIVE) {
      this.eventQueue.push({
        eventType: Battle.EVENT_TYPES.NARRATION,
        narrationText: "It's not very effective.",
      });
    }

    this.eventQueue.push({
      eventType: Battle.EVENT_TYPES.HP_ADJUSTMENT,
      hpAdjustmentTargetPokemonId: defenderPokemon.id,
      hpAdjustment: -netDamage,
    });
  }

  handlePlayerAttack(attackId, attackName) {
    // mutates pokemon state
    const { netDamage, effectiveness } = this.playerPokemon.attackPokemon(attackId, this.rivalPokemon);
    const attackAnimationId = 'attack_animation_id'; // TODO: choose correct animation id

    this.createAttackEvents(
      this.playerPokemon,
      this.rivalPokemon,
      attackName,
      attackAnimationId,
      netDamage,
      effectiveness,
    );
    
  }

  rivalAttack() {
    const rivalAttacks = this.rivalPokemon.getAttackOptions();
    const attack = rivalAttacks[_.random(0, rivalAttacks.length - 1)];
    
    const { netDamage, effectiveness } = this.rivalPokemon.attackPokemon(attack.id, this.playerPokemon);
    const attackAnimationId = 'attack_animation_id'; // TODO: choose correct animation id

    this.createAttackEvents(
      this.rivalPokemon,
      this.playerPokemon,
      attack.name,
      attackAnimationId,
      netDamage,
      effectiveness,
    );
  }
}