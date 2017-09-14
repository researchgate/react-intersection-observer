import React from 'react';
import AdImpression from './AdImpression';

const ImpressionTracking = () => (
    <div>
        <div className="header visible">Criteria: 50% visible pixels + 1 continuous sec</div>
        <div className="body body--center">
            <AdImpression index={1} />
            <AdImpression index={2} />
            <AdImpression index={3} />
        </div>
    </div>
);

export default ImpressionTracking;
