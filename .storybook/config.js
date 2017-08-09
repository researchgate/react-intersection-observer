import * as storybook from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { setDefaults } from '@storybook/addon-info';

setOptions({
  name: 'React Intersection Observer',
  url: 'https://github.com/researchgate/react-intersection-observer',
});

setDefaults({
  source: false,
  propTables: null,
  styles: stylesheet => ({
    ...stylesheet,
    infoBody: {
      ...stylesheet.infoBody,
      background: '#fafafa',
      color: '#444',
      boxShadow: 'rgba(0,0,0,.18) 0 0 2px 0, rgba(0,0,0,.12) 0 1px 3px 0',
      border: 0,
      marginBottom: 50,
    },
  }),
});

storybook.configure(() => require('../stories/index.js'), module);
