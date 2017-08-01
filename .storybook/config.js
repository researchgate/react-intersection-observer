import * as storybook from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'Intersection Observer',
  url: 'https://github.com/Rendez/react-intersection-observer',
});

storybook.configure(() => require('../stories/index.js'), module);
