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
            checked: this.props.selectedHSPIds.some(id => id === this.props.profile.id)
        };
    }

    handleChange = () => {
        const { checked } = this.state;
        const { selectHistoricProfiles, profile } = this.props;

        this.setState({
            checked: !checked
        });

        selectHistoricProfiles([ profile.id ]);
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
    selectHistoricProfiles: PropTypes.func,
    selectedHSPIds: PropTypes.array
};

function mapStateToProps(state) {
    return {
        selectedHSPIds: state.historicProfilesState.selectedHSPIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds))
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(HistoricalProfilesCheckbox));
