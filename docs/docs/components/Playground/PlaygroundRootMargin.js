import React, { Component } from 'react';
import { decorateAction } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs/react';
import Observer from '../../../../src/IntersectionObserver';

const storyBookAction = decorateAction([
    args => ['isIntersecting', 'intersectionRatio'].map(key => `${key}: ${args[0][key]}`),
])('onChange');

export default class WindowRoot extends Component {
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
        const rootMargin = select(
            'rootMargin',
            {
                '0px': '0px',
                '60px': '60px',
                '-60px': '-60px',
                '120px': '120px',
            },
            '60px',
        );

        return (
            <div>
                <div className={`header ${this.state.visibility}`}>
                    {this.state.visibility} → rootMargin={rootMargin}
                </div>
                <div className="body">
                    <Observer onChange={this.handleChange} rootMargin={rootMargin}>
                        <div className={`box ${this.state.visibility}`} />
                    </Observer>
                </div>
            </div>
        );
    }
}
