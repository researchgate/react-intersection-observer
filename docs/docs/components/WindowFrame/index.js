import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import WindowFrame from './WindowFrame';

export default withReadme(Readme, () => <WindowFrame />);
