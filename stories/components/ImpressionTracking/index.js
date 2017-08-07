import React from 'react';
import IntersectionObserver from '../../../src/IntersectionObserver';

class ImpressionTracking extends React.Component {
  state = {
    tracked: '',
  };

  handleChange = event => {
    if (event.isIntersecting) {
      if (event.intersectionRatio >= 0.5) {
        this.recordedTimeout = setTimeout(() => {
          this.setState({ tracked: 'ad--tracked' });
        }, 1000);
        return;
      }
    }
    clearTimeout(this.recordedTimeout);
  };

  render() {
    const options = {
      onChange: this.handleChange,
      threshold: 0.5,
      disabled: !!this.state.tracked,
    };

    return (
      <IntersectionObserver {...options}>
        <div className={`ad ${this.state.tracked}`} />
      </IntersectionObserver>
    );
  }
}

export default ImpressionTracking;
