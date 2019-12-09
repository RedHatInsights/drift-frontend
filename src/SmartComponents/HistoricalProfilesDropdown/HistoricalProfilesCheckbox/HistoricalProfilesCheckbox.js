import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import moment from 'moment';

import { historicProfilesActions } from '../redux';

class HistoricalProfilesCheckbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.selectedPITIds.some(id => id === this.props.profile.id)
        };
    }

    handleChange = () => {
        const { checked } = this.state;
        const { selectHistoricProfile, profile } = this.props;

        this.setState({
            checked: !checked
        });

        selectHistoricProfile(profile.id);
    }

    render() {
        const { profile } = this.props;
        const { checked } = this.state;

        return (
            <React.Fragment>
                <Checkbox
                    label={ moment.utc(profile.created).format('DD MMM YYYY, HH:mm UTC') }
                    isChecked={ checked }
                    onChange={ this.handleChange }
                    aria-label={ profile.id }
                    id={ profile.id }
                    name={ profile.id }
                />
            </React.Fragment>
        );
    }
}

HistoricalProfilesCheckbox.propTypes = {
    profile: PropTypes.object,
    selectHistoricProfile: PropTypes.func,
    selectedPITIds: PropTypes.array
};

function mapStateToProps(state) {
    return {
        selectedPITIds: state.historicProfilesState.selectedPITIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectHistoricProfile: (historicProfileId) => dispatch(historicProfilesActions.selectHistoricProfile(historicProfileId))
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(HistoricalProfilesCheckbox));
