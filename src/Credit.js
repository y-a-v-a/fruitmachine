import React from 'react';

class Credit extends React.Component {
  render() {
    return (
      <span className="credit">{this.props.count}</span>
    );
  }
}

export default Credit;
