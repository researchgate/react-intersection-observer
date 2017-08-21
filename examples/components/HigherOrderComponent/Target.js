import React, { Component } from 'react';

export default class Target extends Component {
  render() {
    return (
      <div className={`box ${this.props.isVisible ? 'visible' : 'transparent'}`}>
        {this.props.isVisible ? 'Visible' : 'Culled'}
      </div>
    );
  }
}
