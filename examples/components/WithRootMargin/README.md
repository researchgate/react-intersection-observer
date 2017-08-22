The option `rootMargin`'s syntax follows that of the `margin` CSS property. The unit(s) however **must** be provided in either `px` or `%` or both. It can also contain _negative values_, which are very useful to shrink the available viewport of the `IntersectionObserver`.

Interestingly a percentage value works great to determine if an item is visible on very different screen sizes, e.g.: mobile vs desktop screens.

Note that in the example below, we conciously show how to set a root to a DOM element, making use of the `disable` option. Since both `Element` and `String` can be used, a more effective way would be to pass a valid `querySelector` string instead.

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