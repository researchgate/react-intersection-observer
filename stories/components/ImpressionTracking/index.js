import React from 'react';
import IntersectionObserver from '../../../src/IntersectionObserver';

class ImpressionTracking extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      tracked: '',
    };
    this.lastRecodedTime = 0;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.isIntersecting) {
      if (event.intersectionRatio >= 0.5) {
        this.lastRecodedTime += event.time;
        if (this.lastRecodedTime > 1000) {
          this.setState({ tracked: 'ad--tracked' });
        }
      }
    }
  }

  render() {
    return (
      <IntersectionObserver onChange={this.handleChange} threshold={[0, 0.5, 0.9]}>
        <div className={`ad ${this.state.tracked}`} />
      </IntersectionObserver>
    );
  }
}

export default ImpressionTracking;
