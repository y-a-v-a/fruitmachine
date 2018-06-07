import React from 'react';

class Credit extends React.Component {
  render() {
    return (
      <span className="credit">{this.props.credit}</span>
    );
  }
}

export default Credit;
