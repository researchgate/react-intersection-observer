import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import IntersectionObserver from '../src/IntersectionObserver';
import WithinWindow from './components/WithinWindow';
import WithinFrame from './components/WithinFrame';
import WithThresholds from './components/WithThresholds';
import WithRootMargin from './components/WithRootMargin';
import OnlyOnce from './components/OnlyOnce';
import ImpressionTracking from './components/ImpressionTracking';
import './components/style.css';

storiesOf('IntersectionObserver', module)
  .add(
    'WithinWindow',
    withInfo(
      `Basic usage of **IntersectionObserver** that changes the className of the observed **<div />** element when the visibility changes:
~~~js
class WithinWindow extends React.Component {
  state = {
    visibility: 'hidden',
  };

  handleChange = (event) => {
    this.setState({
      visibility: event.isIntersecting ? 'visible' : 'invisible',
    });
  };

  render() {
    return (
      &lt;IntersectionObserver onChange={this.handleChange}&gt;
        &lt;div className={\`box \${this.state.visibility}\`} /&gt;
      &lt;IntersectionObserver /&gt;
    );
  }
}
~~~`
    )(() => <WithinWindow />)
  )
  .add(
    'WithinFrame',
    withInfo(`
Usage within a scrollable frame that changes the className of the observed **<div />** element when the visibility changes.
    
For more see **<WithinWindow>** example.
`)(() => <WithinFrame />)
  )
  .add(
    'WithThresholds',
    withInfo(`Usage of **IntersectionObserver** with tresholds, triggering an event for each defined points in the array:
~~~js
class WithinWindow extends React.Component {
  state = {
    visibility: 'hidden',
  };

  thresholds = [0, 0.25, 0.5, 0.75, 1];

  handleChange = ({ isIntersecting, intersectionRatio }) => {
    this.setState({
      visibility: isIntersecting ? 'visible' : 'invisible',
      threshold: getPrintableThreshold(intersectionRatio.toFixed(2), this.thresholds),
    });
  };

  render() {
    // in the example we print out the threshold value, but here we simplify:
    console.log(this.state.threshold * 100 + '%');

    return (
      &lt;IntersectionObserver onChange={this.handleChange} threshold={this.thresholds}&gt;
        &lt;div className={\`box \${this.state.visibility}\`} /&gt;
      &lt;IntersectionObserver /&gt;
    );
  }
}
~~~`)(() => <WithThresholds />)
  )
  .add(
    'WithRootMargin',
    withInfo(`Usage of **IntersectionObserver** with negative bottom rootMargin:
~~~js
class WithinWindow extends React.Component {
  state = {
    visibility: 'hidden',
  };

  handleChange = (event) => {
    this.setState({
      visibility: event.isIntersecting ? 'visible' : 'invisible',
    });
  };

  render() {
    return (
      &lt;div id="scrollable-container"&gt;
        &lt;IntersectionObserver
          onChange={this.handleChange}
          root="scrollable-container"
          rootMargin="0% 0% -25% 0%"
        &gt;
          &lt;div className={\`box \${this.state.visibility}\`} /&gt;
        &lt;IntersectionObserver /&gt;
      &lt;/div&gt;
    );
  }
}
~~~`)(() => <WithRootMargin />)
  )
  .add(
    'OnlyOnce',
    withInfo(`Basic usage of **IntersectionObserver** with **onlyOnce** that will only trigger an event once as soon as **isIntersecting** is true:
~~~js
class WithinWindow extends React.Component {
  state = {
    visibility: 'hidden',
  };

  handleChange = (event) => {
    this.setState({
      visibility: event.isIntersecting ? 'visible' : 'invisible',
    });
  };

  render() {
    return (
      &lt;IntersectionObserver onChange={this.handleChange} onlyOnce&gt;
        &lt;div className={\`box \${this.state.visibility}\`} /&gt;
      &lt;IntersectionObserver /&gt;
    );
  }
}
~~~`)(() => <OnlyOnce />)
  );

storiesOf('Ad Impressions', module).add(
  'ImpressionTracking',
  withInfo(`The requirements for **Viewable Display Ad Impressions** should be counted follow certain criteria and according to the industry standards:

* Pixel Requirement: Greater than or equal to 50% of the pixels in the
advertisement were on an in-focus browser tab on the viewable space of
the browser page, and
* Time Requirement: The time the pixel requirement is met was greater
than or equal to one continuous second, post ad render.

Basic usage of **IntersectionObserver** with **onlyOnce** that will only trigger an event once as soon as **isIntersecting** is true:

~~~js
class AdImpression extends React.Component {
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
    return React.createElement(
      IntersectionObserver,
      {
        onChange: this.handleChange,
        threshold: 0.5,
        disabled: !!this.state.tracked,
      },
      React.createElement('div', { className: 'ad ' + this.state.tracked })
    );
  }
}
~~~`)(() => <ImpressionTracking />)
);
