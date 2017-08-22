## Ad Impressions

The requirements for **Viewable Ad Impressions** should generally follow certain guidelines, industry-related standards, some of which are:

* __Viewable pixels__: Greater than or equal to 50% of the pixels in the
advertisement were on an in-focus browser tab on the viewable space of
the browser page.
* __Viewing time__: The time the pixel requirement is met was greater
than or equal to one continuous second, post ad render.

```jsx
import React from 'react';
import Observer from '@researchgate/react-intersection-observer';

export default class AdImpression extends React.Component {
  state = {
    tracked: '',
  };

  handleChange = event => {
    if (event.isIntersecting && event.intersectionRatio >= 0.5) {
      this.recordedTimeout = setTimeout(() => {
        this.setState({ tracked: 'ad--tracked' });
      }, 1000);
      return;
    }
    clearTimeout(this.recordedTimeout);
  };

  render() {
    return (
      <Observer onChange={this.handleChange} threshold={0.5}>
        <div className={`ad ${this.state.tracked}`} />
      </Observer>
    );
  }
}
```
#### Notes

DoubleClick DFP reporting is following the [Media Rating Council: Viewable Impression Guideline](http://www.mediaratingcouncil.org/063014%20Viewable%20Ad%20Impression%20Guideline_Final.pdf). Different criteria applies to Display ads of different kinds: Video, Images or Framed-content.