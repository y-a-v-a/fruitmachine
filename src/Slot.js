import React from 'react';

class Slot extends React.Component {

  constructor(props) {
    super(props);

    this.localClickHandler = this.localClickHandler.bind(this);
  }

  localClickHandler(event) {
    const index = this.props.index;
    this.props.clickHandler(index);
  }

  render() {
    const classNames = `slot ${this.props.item.isLocked ? 'locked' : ''}`;
    return (
      <span className={classNames} onClick={this.localClickHandler}>{ this.props.item.value }</span>
    );
  }
}

export default Slot;
