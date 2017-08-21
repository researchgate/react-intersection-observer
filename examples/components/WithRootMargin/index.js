import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import WithRootMargin from './WithRootMargin';

export default withReadme(Readme, () => <WithRootMargin />);
