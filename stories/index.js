import React from 'react';
import { storiesOf } from '@storybook/react';
import WithinWindow from './components/WithinWindow';
import WithinFrame from './components/WithinFrame';
import WithThresholds from './components/WithThresholds';
import WithRootMargin from './components/WithRootMargin';
import OnlyOnce from './components/OnlyOnce';
import ImpressionTracking from './components/ImpressionTracking';
import './components/style.css';

storiesOf('IntersectionObserver', module)
  .add('within window', () => <WithinWindow />)
  .add('within frame', () => <WithinFrame />)
  .add('with thresholds', () => <WithThresholds />)
  .add('with rootMargin', () => <WithRootMargin />)
  .add('with onlyOnce', () => <OnlyOnce />);

storiesOf('Ad Impressions', module).add('with threshold 0.5 and 1s', () =>
  <div className="body body--center">
    <ImpressionTracking />
    <ImpressionTracking />
    <ImpressionTracking />
    <ImpressionTracking />
  </div>
);
