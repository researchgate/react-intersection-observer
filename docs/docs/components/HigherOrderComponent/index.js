import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import Component from './Component';

export default withReadme(Readme, () => (
    <div>
        <div className="header visible">Higher Order Component - Occlusion Culling</div>
        <div className="body body--center">
            <Component />
            <Component />
            <Component />
            <Component />
            <Component />
        </div>
    </div>
));
