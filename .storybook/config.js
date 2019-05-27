import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
    name: 'React Intersection Observer',
    url: 'https://github.com/researchgate/react-intersection-observer',
    downPanelInRight: true,
});

configure(() => require('../docs/docs/index.js'), module);
