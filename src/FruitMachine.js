import React from 'react';
import Credit from './Credit';
import Button from './Button';
import Slots from './Slots';

class FruitMachine extends React.Component {

  constructor(props) {
    super(props);
    this.options = [...'🍌🍇🍒🍑🍓🍉🥑🍋'];
    this.slots = 3;
    this.timerIds = [];

    this.clickHandler = this.clickHandler.bind(this);

    this.state = {
      isRunning: false,
      count: 10,
      slotValues: [...'🍒'.repeat(this.slots)],
      result: []
    }
  }

  clickHandler(event) {
    if (this.state.isRunning || this.state.count <= 0) {
      return;
    }

    this.setState(prevState => ({
      isRunning: !prevState.isRunning,
      count: (prevState.count - 1),
      result: []
    }));

    for (let i = 0; i < this.slots; i++) {
      this.runner(~~(Math.random() * 10) + 20, i);
    }
  }

  runner(runs, i) {
    if (runs === 0) {
      clearTimeout(this.timerIds[i]);
      this.setState(prevState => {
        prevState.result.push(prevState.slotValues[i]);
        if (prevState.result.length === 3) {
          prevState.count = prevState.count + this.defineScore([].concat(prevState.result));
          prevState.isRunning = false;
        }
        return prevState;
      });
      return;
    }
    let newRuns = runs - 1;

    let newSlotValue = this.options[~~(Math.random() * this.options.length)];

    this.setState(prevState => {
      prevState.slotValues[i] = newSlotValue;
      return prevState;
    });

    this.timerIds[i] = setTimeout(this.runner.bind(this, newRuns, i), 800 / runs);
  }

  defineScore(result) {
    const score = result.reduce((acc, el, arr) => {
      return acc.indexOf(el) > -1 ? acc : acc.push(el), acc;
    }, []);

    switch(score.length) {
      case 1:
        return 5;
        break;
      case 2:
        return 2;
        break;
      default:
        return 0;
        break;
    }
  }

  render() {
    const count = this.state.count;

    return (
      <div className="game">
        <Slots slotValues={this.state.slotValues} />
        <div className="controls">
          <Credit count={count} />
          <Button clickHandler={this.clickHandler} />
        </div>
      </div>
    )
  }
}

export default FruitMachine;
