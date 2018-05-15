import 'babel-polyfill';
import 'intersection-observer';
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import WindowRoot from './components/WindowRoot';
import WindowFrame from './components/WindowFrame';
import WithThresholds from './components/WithThresholds';
import WithRootMargin from './components/WithRootMargin';
import OnlyOnce from './components/OnlyOnce';
import ImpressionTracking from './components/ImpressionTracking';
import HigherOrderComponent from './components/HigherOrderComponent';
import PlaygroundRootMargin from './components/Playground';
import './components/style.css';

storiesOf('Examples', module)
    .add('Window', WindowRoot)
    .add('Frame', WindowFrame)
    .add('Thresholds', WithThresholds)
    .add('Margin', WithRootMargin)
    .add('Once', OnlyOnce);

storiesOf('Recipes', module)
    .add('Higher Order Component', HigherOrderComponent)
    .add('Ad Impressions', ImpressionTracking);

storiesOf('Playground', module)
    .addDecorator(withKnobs)
    .add('rootMargin', () => <PlaygroundRootMargin />);
