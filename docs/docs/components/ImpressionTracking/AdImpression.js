import React from 'react';
import PropTypes from 'prop-types';
import { action } from '@storybook/addon-actions';
import Observer from '../../../../src/IntersectionObserver';

const tracked = action('tracked');

export default class AdImpression extends React.Component {
    state = {
        tracked: '',
    };

    handleChange = event => {
        if (event.isIntersecting && event.intersectionRatio >= 0.5) {
            this.recordedTimeout = setTimeout(() => {
                this.setState({ tracked: 'ad--tracked' });
                tracked(`ad #${this.props.index}`);
            }, 1000);
            return;
        }
        clearTimeout(this.recordedTimeout);
    };

    render() {
        return (
            <Observer onChange={this.handleChange} threshold={0.5}>
                <div className={`ad ${this.state.tracked}`} />
            </Observer>
        );
    }
}

AdImpression.propTypes = {
    index: PropTypes.number.isRequired,
};
