import React from 'react';

class Slot extends React.Component {
  render() {
    return (
      <span>{ this.props.item }</span>
    );
  }
}

export default Slot;
