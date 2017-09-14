import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import WindowRoot from './WindowRoot';

export default withReadme(Readme, () => <WindowRoot />);
