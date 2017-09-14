import React, { Component } from 'react';
import { decorateAction } from '@storybook/addon-actions';
import Observer from '../../../../src/IntersectionObserver';

const storyBookAction = decorateAction([
    args => ['isIntersecting', 'intersectionRatio'].map(key => `${key}: ${args[0][key]}`),
])('onChange');

export default class OnlyOnce extends Component {
    state = {
        visibility: 'hidden',
    };

    handleChange = event => {
        storyBookAction(event);
        this.setState({
            visibility: event.isIntersecting ? 'visible' : 'invisible',
        });
    };

    render() {
        return (
            <div>
                <div className={`header ${this.state.visibility}`}>{this.state.visibility}</div>
                <div className="body">
                    <Observer onChange={this.handleChange} onlyOnce>
                        <div className={`box ${this.state.visibility}`} />
                    </Observer>
                </div>
            </div>
        );
    }
}
