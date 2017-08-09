import React from 'react';
import { action } from '@storybook/addon-actions';
import IntersectionObserver from '../../../src/IntersectionObserver';

const tracked = action('tracked');

class AdImpression extends React.Component {
  state = {
    tracked: '',
  };

  handleChange = event => {
    if (event.isIntersecting) {
      if (event.intersectionRatio >= 0.5) {
        this.recordedTimeout = setTimeout(() => {
          this.setState({ tracked: 'ad--tracked' });
          tracked(`ad #${this.props.index}`);
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

export default AdImpression;
