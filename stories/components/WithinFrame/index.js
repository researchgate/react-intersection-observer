import React from 'react';
import { decorateAction } from '@storybook/addon-actions';
import IntersectionObserver from '../../../src/IntersectionObserver';

const storyBookAction = decorateAction([
  args => ['isIntersecting', 'intersectionRatio'].map(key => `${key}: ${args[0][key]}`),
])('onChange');

class WithinFrame extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      visibility: 'hidden',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    storyBookAction(event);
    this.setState({
      visibility: event.isIntersecting ? 'visible' : 'invisible',
    });
  }

  render() {
    return (
      <div>
        <div className={`header ${this.state.visibility}`}>
          {this.state.visibility}
        </div>
        <div className="body body--frame">
          <div className="scroller">
            <div className="frame">
              <div className="box-inner">scroll here</div>
              <IntersectionObserver onChange={this.handleChange}>
                <div className={`box ${this.state.visibility}`} />
              </IntersectionObserver>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WithinFrame;
