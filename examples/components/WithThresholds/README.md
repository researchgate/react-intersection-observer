Usage of **IntersectionObserver** with tresholds, triggering an event for each defined points in the array:

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