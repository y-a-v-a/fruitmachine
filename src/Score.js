import React from 'react';

class Score extends React.Component {
  render() {
    const potentialScoreClasses = `score ${this.props.potentialScore > 0 ? 'blink' : ''}`;

    return (
      <React.Fragment>
        <span className={potentialScoreClasses}>{this.props.potentialScore}</span>
        <span className="score">{this.props.score}</span>
      </React.Fragment>
    );
  }
}

export default Score;
