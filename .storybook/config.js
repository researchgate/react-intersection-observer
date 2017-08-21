import * as storybook from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'React Intersection Observer',
  url: 'https://github.com/researchgate/react-intersection-observer',
  downPanelInRight: true,
});

storybook.configure(() => require('../examples/index.js'), module);
