import React from 'react';

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span className="button" onClick={this.props.clickHandler}>🔴</span>
    );
  }
}

export default Button;
