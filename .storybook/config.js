import * as storybook from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import infoAddon from '@storybook/addon-info';

setOptions({
  name: 'React Intersection Observer',
  url: 'https://github.com/researchgate/react-intersection-observer',
});

storybook.setAddon(infoAddon);

storybook.configure(() => require('../stories/index.js'), module);
