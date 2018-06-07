import React from 'react';

class Button extends React.Component {
  render() {
    return (
      <span className="button" onClick={this.props.clickHandler}>{this.props.label}</span>
    );
  }
}

export default Button;
