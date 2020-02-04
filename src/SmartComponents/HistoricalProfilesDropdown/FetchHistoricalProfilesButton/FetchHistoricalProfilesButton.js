import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';

class FetchHistoricalProfilesButton extends Component {
    constructor(props) {
        super(props);
    }

    fetchHistoricalComparison = () => {
        const { baselines, systems, selectedHSPIds } = this.props;
        let baselineIds = baselines.map(baseline => baseline.id);
        let systemIds = systems.map(system => system.id);

        this.props.fetchCompare(systemIds, baselineIds, selectedHSPIds);
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
    fetchHistoricalComparison: PropTypes.func,
    baselines: PropTypes.array,
    systems: PropTypes.array,
    selectedHSPIds: PropTypes.array,
    fetchCompare: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state) {
    return {
        baselines: state.compareState.baselines,
        systems: state.compareState.systems,
        selectedHSPIds: state.historicProfilesState.selectedHSPIds
    };
}

export default withRouter(connect(mapStateToProps, null)(FetchHistoricalProfilesButton));
