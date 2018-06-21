import React from 'react';
import { TransitionGroup,CSSTransition } from 'react-transition-group';

class Slot extends React.Component {
  render() {
    return (
      <TransitionGroup component="span" className="slot">
        <CSSTransition classNames="slot" key={this.props.item} timeout={{enter:this.props.timing, exit:this.props.timing}}>
          <span style={{transitionDuration: `${this.props.timing}ms`}} >{ this.props.item }</span>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

export default Slot;
