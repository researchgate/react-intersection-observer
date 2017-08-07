import React from 'react';
import { decorateAction } from '@storybook/addon-actions';
import IntersectionObserver from '../../../src/IntersectionObserver';

const storyBookAction = decorateAction([
  args =>
    ['isIntersecting', 'intersectionRatio'].map(key => `${key}: ${args[0][key]}`).concat(['rootMargin: 0% 0% -25% 0%']),
])('onChange');

class WithRootMargin extends React.Component {
  state = {
    visibility: 'invisible',
    scroller: null,
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
        <div className="body body--frame">
          <div
            className="scroller scroller--gradient"
            ref={node => {
              if (!this.state.scroller) {
                this.setState({ scroller: node });
              }
            }}
          >
            <div className="frame">
              <div className="box-inner">
                <i>root</i>: &lt;div&gt;, <i>rootMargin:</i> 0% 0% -25% 0%
              </div>
              <IntersectionObserver
                onChange={this.handleChange}
                disabled={!this.state.scroller}
                root={this.state.scroller}
                rootMargin="0% 0% -25% 0%"
              >
                <div className={`box ${this.state.visibility}`} />
              </IntersectionObserver>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WithRootMargin;
