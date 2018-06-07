import React from 'react';
import Credit from './Credit';
import Button from './Button';
import Slots from './Slots';
import Score from './Score';
import {defineScore} from './Utils';

class FruitMachine extends React.Component {

  constructor(props) {
    super(props);
    this.options = [...'🍌🍇🍒🍑🍓🍉🥑🥑🍋🍋🍋'];
    this.slots = 4;
    this.timerIds = [];

    this.clickHandler = this.clickHandler.bind(this);
    this.clickHandlerScore = this.clickHandlerScore.bind(this);
    this.clickHandlerLock = this.clickHandlerLock.bind(this);

    this.state = {
      isRunning: false,
      credit: 10,
      score: 0,
      slots: this.initiateSlotValues(this.slots),
      totalLocked: 0,
      potentialScore: 0,
      disallowLock: true
    }
  }

  /**
   * Initiate basic state for the amount of slots
   * @param {number} amount Number of slots
   */
  initiateSlotValues(amount) {
    let slots = {};
    for (let i = 0; i < amount; i++) {
      slots[`slot${i}`] = {
        value: '🍒',
        isLocked: false
      };
    }
    return slots;
  }

  clickHandler(event) {
    const {isRunning, credit} = this.state;
    let {score, potentialScore} = this.state;

    if (isRunning || credit <= 0) {
      return;
    }

    if (this.state.totalLocked === 0) {
      score = score + potentialScore;
      potentialScore = 0;
    }

    this.setState(state => ({
      isRunning: true,
      credit: (state.credit - 1),
      score,
      potentialScore
    }));

    let promises = [];
    for (let i = 0; i < this.slots; i++) {
      promises.push(this.runnerPromise(`slot${i}`));
    }

    Promise.all(promises).then(result => {
      let potentialScore = defineScore(result);
      const {totalLocked, slots, score} = this.state;
      let newScore = score;
      
      Object.keys(slots).forEach(index => slots[index].isLocked = false);

      if (totalLocked > 0) {
        newScore += potentialScore;
        potentialScore = 0;
      }

      this.setState(state => ({
        isRunning: false,
        potentialScore,
        totalLocked: 0,
        slots,
        disallowLock: state.totalLocked > 0,
        score: newScore
      }));
    });
  }

  runnerPromise(id) {
    let timerId;
    let newSlotValue;

    if (this.state.totalLocked && this.state.slots[id].isLocked) {
      return Promise.resolve(this.state.slots[id].value);
    }

    return new Promise((resolve, reject) => {
      let runs = ~~(Math.random() * 10) + 20;

      const runner = runs => {
        if (runs === 0) {
          clearTimeout(timerId);
          return resolve(newSlotValue);
        }
        let newRuns = runs - 1;
        newSlotValue = this.options[~~(Math.random() * this.options.length)];

        this.setState(state => {
          state.slots[id].value = newSlotValue;
          return state;
        });

        timerId = setTimeout(runner, (800 / runs), newRuns);
      };

      runner(runs);
    });
  }

  /**
   * Monetize the score into credits
   * @param {Object} event Event object
   */
  clickHandlerScore(event) {
    const {score, credit, potentialScore} = this.state;

    if (score && !potentialScore) {
      this.setState(state => {
        state.credit = Math.round(score / 2) + credit;
        state.score = 0;
        return state;
      });
    }
    if (potentialScore) {
      this.setState(state => {
        state.score = state.score + state.potentialScore;
        state.potentialScore = 0;
        state.disallowLock = true;
        Object.keys(state.slots).forEach(index => state.slots[index].isLocked = false);
        return state;
      });
    }
  }

  /**
   * Handle a click on a slot and toggle isLocked
   * @param {string} index Index of slot like slot1, slot2, etc
   */
  clickHandlerLock(index) {
    if (this.state.isRunning || this.state.totalLocked > (this.slots - 1)
      || this.state.disallowLock || (this.state.potentialScore === 6)) {
      return;
    }

    this.setState(state => {
      const slot = state.slots[index];
      slot.isLocked = !slot.isLocked;
      state.totalLocked = state.totalLocked + (slot.isLocked ? 1 : -1);
      return state;
    });
  }

  render() {
    const {credit, slots, score, potentialScore, isRunning} = this.state;

    return (
      <div className="game">
        <Slots slots={slots} clickHandler={this.clickHandlerLock} />
        <div className="controls">
          <Score score={score} potentialScore={potentialScore} />
          <Button
            clickHandler={this.clickHandlerScore}
            label="💸"
            additionalClassNames={score || potentialScore ? '' : 'passive'} />
        </div>
        <div className="controls">
          <Credit credit={credit} />
          <Button
            clickHandler={this.clickHandler}
            label={isRunning || (credit === 0) ? "⚪️" : "🔴" }
            additionalClassNames=""/>
        </div>
      </div>
    )
  }
}

export default FruitMachine;
