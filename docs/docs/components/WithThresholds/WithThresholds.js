import React, { Component } from 'react';
import { decorateAction } from '@storybook/addon-actions';
import Observer from '../../../../src/IntersectionObserver';

const storyBookAction = decorateAction([
    args =>
        ['isIntersecting', 'intersectionRatio']
            .map(key => `${key}: ${args[0][key]}`)
            .concat('thresholds: [0, 0.25, 0.5, 0.75, 1]'),
])('onChange');

const getPrintableThreshold = (ratio, range) =>
    range.reduce((prev, curr) => (Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev));

export default class WithThresholds extends Component {
    state = {
        visibility: 'hidden',
        threshold: 0,
    };

    handleChange = event => {
        storyBookAction(event);
        this.setState({
            visibility: event.isIntersecting ? 'visible' : 'invisible',
            threshold: getPrintableThreshold(event.intersectionRatio.toFixed(2), [0, 0.25, 0.5, 0.75, 1]),
        });
    };

    render() {
        return (
            <div>
                <div className={`header ${this.state.visibility}`}>{this.state.threshold * 100}%</div>
                <div className="body">
                    <div className={this.state.visibility}>
                        <Observer onChange={this.handleChange} threshold={[0, 0.25, 0.5, 0.75, 1]}>
                            <div className={`box ${this.state.visibility}`} />
                        </Observer>
                    </div>
                </div>
            </div>
        );
    }
}
