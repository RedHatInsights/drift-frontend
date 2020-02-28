import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';

class FetchHistoricalProfilesButton extends Component {
    constructor(props) {
        super(props);

        this.fetchHistoricalComparison = this.fetchHistoricalComparison.bind(this);
    }

    async fetchHistoricalComparison() {
        this.props.fetchCompare();
    }

    render() {
        return (
            <Button
                style={ { float: 'left' } }
                variant='primary'
                onClick={ this.fetchHistoricalComparison }>
                Compare
            </Button>
        );
    }
}

FetchHistoricalProfilesButton.propTypes = {
    fetchCompare: PropTypes.func
};

export default FetchHistoricalProfilesButton;
