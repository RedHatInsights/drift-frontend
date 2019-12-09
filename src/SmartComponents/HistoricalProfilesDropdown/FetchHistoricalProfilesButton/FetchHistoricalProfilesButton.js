import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';

import { setHistory } from '../../../Utilities/SetHistory';
import { compareActions } from '../../modules';

class FetchHistoricalProfilesButton extends Component {
    constructor(props) {
        super(props);
    }

    fetchHistoricalComparison = () => {
        const { baselines, systems, selectedPITIds, fetchCompare, history } = this.props;
        let baselineIds = baselines.map(baseline => baseline.id);
        let systemIds = systems.map(system => system.id);

        setHistory(history, systemIds, baselineIds, selectedPITIds);
        fetchCompare(systemIds, baselineIds, selectedPITIds);
    }

    render() {
        return (
            <Button
                className='fetch-historic-button'
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
    selectedPITIds: PropTypes.array,
    fetchCompare: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state) {
    return {
        baselines: state.compareState.baselines,
        systems: state.compareState.systems,
        selectedPITIds: state.historicProfilesState.selectedPITIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: (systemIds, baselineIds, selectedPITIds) => dispatch(compareActions.fetchCompare(systemIds, baselineIds, selectedPITIds))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FetchHistoricalProfilesButton));
