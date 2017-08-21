Usage of **IntersectionObserver** with negative bottom rootMargin:

```jsx
import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';

export default class WithRootMargin extends Component {
  state = {
    visibility: 'invisible',
    scroller: null,
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
              <Observer
                onChange={this.handleChange}
                disabled={!this.state.scroller}
                root={this.state.scroller}
                rootMargin="0% 0% -25%"
              >
                <div className={`box ${this.state.visibility}`} />
              </Observer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
```