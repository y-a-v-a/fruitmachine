import React from 'react';

class Button extends React.Component {
  render() {
    const classNames = `button ${this.props.additionalClassNames }`;
    return (
      <span className={classNames} onClick={this.props.clickHandler}>{this.props.label}</span>
    );
  }
}

export default Button;
