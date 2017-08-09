import React from 'react';
import { decorateAction } from '@storybook/addon-actions';
import IntersectionObserver from '../../../src/IntersectionObserver';

const storyBookAction = decorateAction([
  args => ['isIntersecting', 'intersectionRatio'].map(key => `${key}: ${args[0][key]}`),
])('onChange');

class OnlyOnce extends React.Component {
  state = {
    visibility: 'hidden',
  };

  handleChange = event => {
    storyBookAction(event);
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
          <IntersectionObserver onChange={this.handleChange} onlyOnce>
            <div className={`box ${this.state.visibility}`} />
          </IntersectionObserver>
        </div>
      </div>
    );
  }
}

export default OnlyOnce;
