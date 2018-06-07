import React from 'react';
import Slot from './Slot';

class Slots extends React.Component {

  render() {
    const slots = [];
    const slotsKeys = Object.keys(this.props.slots);
    for (let i = 0; i < slotsKeys.length; i++) {
      const id = slotsKeys[i];
      const item = this.props.slots[id];
      slots.push(<Slot item={item} key={i} index={id} clickHandler={this.props.clickHandler} />);
    }

    return (
      <div className="slots">
        {slots}
      </div>
    );
  }
}

export default Slots;
