Basic usage of **IntersectionObserver** that changes the className of the observed **<div />** element when the visibility changes:

```jsx
import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';

export default class WindowRoot extends Component {
  state = {
    visibility: 'hidden',
  };

  handleChange = event => {
    this.setState({
      visibility: event.isIntersecting ? 'visible' : 'invisible',
    });
  };

  render() {
    return (
      <div>
        <div className={`header ${this.state.visibility}`}>
          {this.state.visibility}
        </div>
        <div className="body">
          <Observer onChange={this.handleChange}>
            <div className={`box ${this.state.visibility}`} />
          </Observer>
        </div>
      </div>
    );
  }
}
```