The option `threshold` is either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed. If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5. If you want the callback run every time visibility passes another 25%, you would specify the array `[0, 0.25, 0.5, 0.75, 1]`.

The default is `0` (meaning as soon as even one pixel is visible, the callback will be run).
A value of `1.0` means that the threshold isn't considered passed until every pixel is visible.

Note that when comparing old and new props, the component will compare the values within the `treshold` array in the same order, so you don't necessarily have to keep a reference to it. This is specially useful when using within a functional component.

```jsx
import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';

const getPrintableThreshold = (ratio, range) =>
  range.reduce((prev, curr) =>
    Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev);

export default class WithThresholds extends Component {
  state = {
    visibility: 'hidden',
    threshold: 0,
  };

  handleChange = ({ isIntersecting, intersectionRatio }) => {
    this.setState({
      visibility: isIntersecting ? 'visible' : 'invisible',
      threshold: getPrintableThreshold(
        intersectionRatio.toFixed(2),
        [0, 0.25, 0.5, 0.75, 1]
      ),
    });
  };

  render() {
    return (
      <div>
        <div className={`header ${this.state.visibility}`}>
          {this.state.threshold * 100}%
        </div>
        <div className="body">
          <div className={this.state.visibility}>
            <Observer
              onChange={this.handleChange}
              threshold={[0, 0.25, 0.5, 0.75, 1]}
            >
              <div className={`box ${this.state.visibility}`} />
            </Observer>
          </div>
        </div>
      </div>
    );
  }
}

```