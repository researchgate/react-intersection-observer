import React from 'react';
import { storiesOf } from '@storybook/react';
import IntersectionObserver from '../src/IntersectionObserver';
import WithinWindow from './components/WithinWindow';
import WithinFrame from './components/WithinFrame';
import WithThresholds from './components/WithThresholds';
import WithRootMargin from './components/WithRootMargin';
import OnlyOnce from './components/OnlyOnce';
import ImpressionTracking from './components/ImpressionTracking';
import './components/style.css';

const infoOptions = {
  source: false,
  propTables: null,
  // propTablesExclude: [WithinWindow, WithinFrame, WithThresholds, WithRootMargin, OnlyOnce],
  styles: stylesheet => ({
    ...stylesheet,
    infoBody: {
      ...stylesheet.infoBody,
      background: '#fafafa',
      color: '#444',
      boxShadow: 'rgba(0,0,0,.18) 0 0 2px 0, rgba(0,0,0,.12) 0 1px 3px 0',
      border: 0,
    },
  }),
};

storiesOf('IntersectionObserver', module)
  .addWithInfo(
    'WithinWindow',
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
    return React.createElement(
      IntersectionObserver,
      { onChange: this.handleChange },
      React.createElement('div', { className: 'box ' + this.state.visibility })
    );
  }
}
~~~`,
    () => <WithinWindow />,
    { ...infoOptions, propTables: [IntersectionObserver] }
  )
  .addWithInfo(
    'WithinFrame',
    `
Usage within a scrollable frame that changes the className of the observed **<div />** element when the visibility changes.
    
For more see **<WithinWindow>** example.
`,
    () => <WithinFrame />,
    infoOptions
  )
  .addWithInfo(
    'WithThresholds',
    `Usage of **IntersectionObserver** with tresholds, triggering an event for each defined points in the array:
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

    return React.createElement(
      IntersectionObserver,
      {
        onChange: this.handleChange,
        threshold: this.thresholds,
      },
      React.createElement('div', { className: 'box ' + this.state.visibility })
    );
  }
}
~~~`,
    () => <WithThresholds />,
    infoOptions
  )
  .addWithInfo(
    'WithRootMargin',
    `Usage of **IntersectionObserver** with negative bottom rootMargin:
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
    const ObservableElement = React.createElement(
      IntersectionObserver,
      {
        onChange: this.handleChange,
        root: '#scrollable-container,
        rootMargin: '0% 0% -25% 0%'
      },
      React.createElement('div', { className: 'box ' + this.state.visibility })
    );

    return React.createElement('div', { id: 'scrollable-container' }, ObservableElement);
  }
}
~~~`,
    () => <WithRootMargin />,
    infoOptions
  )
  .addWithInfo(
    'OnlyOnce',
    `Basic usage of **IntersectionObserver** with **onlyOnce** that will only trigger an event once as soon as **isIntersecting** is true:
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
    return React.createElement(
      IntersectionObserver,
      {
        onChange: this.handleChange,
        onlyOnce: true,
      },
      React.createElement('div', { className: 'box ' + this.state.visibility })
    );
  }
}
~~~`,
    () => <OnlyOnce />,
    infoOptions
  );

storiesOf('Ad Impressions', module).addWithInfo(
  'ImpressionTracking',
  `The requirements for **Viewable Display Ad Impressions** should be counted follow certain criteria and according to the industry standards:

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
~~~`,
  () => <ImpressionTracking />,
  infoOptions
);
