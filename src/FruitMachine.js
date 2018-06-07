import React from 'react';
import Credit from './Credit';
import Button from './Button';
import Slots from './Slots';
import Score from './Score';

class FruitMachine extends React.Component {

  constructor(props) {
    super(props);
    this.options = [...'🍌🍇🍒🍑🍓🍉🥑🍋'];
    this.slots = 3;
    this.timerIds = [];

    this.clickHandler = this.clickHandler.bind(this);
    this.clickHandlerScore = this.clickHandlerScore.bind(this);
    this.clickHandlerLock = this.clickHandlerLock.bind(this);

    this.state = {
      isRunning: false,
      credit: 10,
      score: 0,
      slots: this.initiateSlotValues(this.slots),
      totalLocked: 0
    }
  }

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
    if (isRunning || credit <= 0) {
      return;
    }

    this.setState(state => ({
      isRunning: true,
      credit: (state.credit - 1)
    }));

    let promises = [];
    for (let i = 0; i < this.slots; i++) {
      promises.push(this.runnerPromise(`slot${i}`));
    }

    Promise.all(promises).then(result => {
      let score = this.defineScore(result);

      this.setState(state => ({
        isRunning: false,
        lastResult: score
      }));
    });
  }

  runnerPromise(id) {
    let timerId;
    let newSlotValue;

    // if (this.state.totalLocked && this.state.locks.indexOf(`${id}`) > -1) {
    //   return Promise.resolve(this.state.slotValues[id]);
    // }

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

  defineScore(result) {
    const score = result.reduce((acc, el) => {
      return acc.indexOf(el) > -1 ? acc : acc.push(el), acc;
    }, []);

    switch(score.length) {
      case 1:
        return 5;
      case 2:
        return 2;
      default:
        return 0;
    }
  }

  /**
   * Monetize the score into credits
   * @param {Object} event Event object
   */
  clickHandlerScore(event) {
    const {score, credit} = this.state;

    if (score) {
      this.setState(state => {
        state.credit = Math.round(score / 2) + credit;
        state.score = 0;
        return state;
      });
    }
  }

  /**
   * Handle a click on a slot and toggle isLocked
   * @param {string} index Index of slot like slot1, slot2, etc
   */
  clickHandlerLock(index) {
    if (this.state.isRunning || this.state.totalLocked > this.slots - 1) {
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
    const {credit, slots, score} = this.state;

    return (
      <div className="game">
        <Slots slots={slots} clickHandler={this.clickHandlerLock} />
        <div className="controls">
          <Credit credit={credit} />
          <Button clickHandler={this.clickHandler} label="🔴" />
        </div>
        <div className="controls">
          <Score score={score} />
          <Button clickHandler={this.clickHandlerScore} label="💸" />
        </div>
      </div>
    )
  }
}

export default FruitMachine;
