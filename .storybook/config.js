import { addDecorator, configure } from '@storybook/react';
import { addReadme } from 'storybook-readme';

addDecorator(addReadme);
configure(() => require('../docs/docs'), module);
