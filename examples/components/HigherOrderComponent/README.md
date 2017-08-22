## Higher order component

A common way to avoid repetiton and dynamic option setting is to use _HOC_. Since our component reuses instances based on **all** the options, you don't have to worry about bookkeeping of instances. Create as many HOC as you need; they can be as flexible as you need them to be.

The next example illustrates in a simple way how a _HOC_ is used to wrap target elements for occlusion culling:

### withIntersectionObserver.js
```jsx
import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';

export default threshold => BaseComponent => {
  const displayName = BaseComponent.displayName || BaseComponent.name || 'Component';

  return class WithIntersectionObserver extends Component {
    static displayName = `withIntersectionObserver(${displayName})`;

    state = {
      isIntersecting: false,
    };

    handleChange = ({ isIntersecting, intersectionRatio }) => {
      this.setState({ isIntersecting: isIntersecting && intersectionRatio >= threshold });
    };

    render() {
      return (
        <Observer onChange={this.handleChange} threshold={threshold}>
          <BaseComponent {...this.props} isVisible={this.state.isIntersecting} />
        </Observer>
      );
    }
  };
};
```

### Target.js
```jsx
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
```

### Component.js
```jsx
import withIntersectionObserver from './WithIntersectionObserver';
import Target from './Target';

export default withIntersectionObserver(0.99)(Target);
```

### Example.js
```jsx
import React from 'react';
import Component from './Component';

export default () =>
  <div>
    <div className="header visible">Higher Order Component - Occlusion Culling</div>
    <div className="body body--center">
      <Component />
      <Component />
      <Component />
      <Component />
      <Component />
    </div>
  </div>
);
```