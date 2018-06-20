import React from 'react';
import Credit from './Credit';
import Button from './Button';
import Slots from './Slots';

class FruitMachine extends React.Component {

  constructor(props) {
    super(props);
    this.reels = [
      [...'🏆🍇🍊🍇🍊🍇🍊🍇🎰🍒🍊🛎🍊🍓🎰🍊📯🍇'],
      [...'🏆🛎📯🛎🍒🍊🍇🍒🛎📯🛎🍓🍇🎰🛎📯🛎🍓'],
      [...'🏆🍒🍊📯🍊🥑🍊🍇🍊🍇🍊🍇🛎🍓🎰🛎🍒🥑']
    ];
    this.slots = 3;
    this.timerIds = [];

    this.clickHandler = this.clickHandler.bind(this);

    this.state = {
      isRunning: false,
      count: 20,
      slotValues: [...'🍒'.repeat(this.slots)]
    }
  }

  clickHandler(event) {
    const {isRunning, count} = this.state;
    if (isRunning || count <= 0) {
      return;
    }

    this.setState(state => ({
      isRunning: !state.isRunning,
      count: (state.count - 1)
    }));

    let promises = [];
    for (let i = 0; i < this.slots; i++) {
      promises.push(this.runnerPromise(i));
    }

    Promise.all(promises).then(result => {
      let score = this.defineScoreVariant(result);

      this.setState(state => ({
        isRunning: false,
        count: state.count + score
      }));
    });
  }

  runnerPromise(id) {
    let timerId;
    let newSlotValue;

    return new Promise((resolve, reject) => {
      let runs = ~~(Math.random() * 10) + 20;

      const runner = runs => {
        if (runs === 0) {
          clearTimeout(timerId);
          return resolve(newSlotValue);
        }
        let newRuns = runs - 1;
        newSlotValue = this.reels[id][~~(Math.random() * this.reels[id].length)];

        this.setState(state => {
          state.slotValues[id] = newSlotValue;
          return state;
        });

        timerId = setTimeout(runner, (800 / runs), newRuns);
      };

      runner(runs);
    });
  }

  defineScoreVariant(result) {
    const res = result.join('');
    let score = 0;

    switch(true) {
      case (res === '🏆🏆🏆'):
      score = 32;
      break;
      case (res === '🎰🎰🎰'):
      case (res === '🛎🛎🛎'):
      score = 16;
      break;
      case /(.)\1\1/u.test(res): // any other combo of 3
      score = 8;
      break;
      case /(📯|🎰|🍒|🍓)\1|(📯|🎰|🍒|🍓).+?\2/u.test(res): // combo of 2 of 📯, 🎰, 🍒, 🍓
      score = 4;
      break;
      case /(🛎|🍇)\1|(🛎|🍇).+?\2/u.test(res): // combo of 2 of 🛎, 🍇
      score = 2;
      break;
      case /(🍊)\1|(🍊).+?\2/u.test(res): // combo of 2 of 🍊
      case /🎰/u.test(res): // any 1 🎰
      score = 1;
      break;
      default:
      score = 0;
      break;
    }
    console.log(res, score);
    return score;
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

  render() {
    const {count, slotValues} = this.state;

    return (
      <div className="game">
        <Slots slotValues={slotValues} />
        <div className="controls">
          <Credit count={count} />
          <Button clickHandler={this.clickHandler} />
        </div>
      </div>
    )
  }
}

export default FruitMachine;
