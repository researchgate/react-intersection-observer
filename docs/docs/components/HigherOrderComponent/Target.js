import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Target extends Component {
    render() {
        return (
            <div className={`box ${this.props.isVisible ? 'visible' : 'transparent'}`}>
                {this.props.isVisible ? 'Visible' : 'Culled'}
            </div>
        );
    }
}

Target.propTypes = {
    isVisible: PropTypes.bool,
};
