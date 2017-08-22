The option `onlyOnce` applied to the component will only trigger an event once, when the target detects `isIntersecting` is truthy. This is specially useful when you need a disposable observer, and you want to prevent re-rendering the element after that:

```jsx
import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';

export default class OnlyOnce extends Component {
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
          <Observer onChange={this.handleChange} onlyOnce>
            <div className={`box ${this.state.visibility}`} />
          </Observer>
        </div>
      </div>
    );
  }
}
```