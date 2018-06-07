import React from 'react';

class Score extends React.Component {
  render() {
    return (
      <span className="score">{this.props.score}</span>
    );
  }
}

export default Score;
