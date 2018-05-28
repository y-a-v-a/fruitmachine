import React from 'react';
import Slot from './Slot';

class Slots extends React.Component {

  render() {
    const slots = [];
    for (let i = 0; i < this.props.slotValues.length; i++) {
      let item = this.props.slotValues[i];
      slots.push(<Slot item={item} key={i} />);
    }

    return (
      <div className="slots">
        {slots}
      </div>
    );
  }
}

export default Slots;
