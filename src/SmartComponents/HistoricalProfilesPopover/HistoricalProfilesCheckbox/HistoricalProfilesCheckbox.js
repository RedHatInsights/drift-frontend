import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import moment from 'moment';

export class HistoricalProfilesCheckbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: this.findChecked()
        };
    }

    findChecked = () => {
        const { profile, selectedHSPIds, entities, updateBadgeCount } = this.props;
        let checked;

        if (profile.captured_date === 'Latest') {
            checked = entities.selectedSystemIds.some(id => id === profile.id);
            updateBadgeCount(checked);
        } else {
            checked = selectedHSPIds.some(id => id === profile.id);
        }

        return checked;
    }

    handleChange = () => {
        const { checked } = this.state;
        const { onSelect, profile } = this.props;

        this.setState({
            checked: !checked
        });

        onSelect(checked, profile);
    }

    render() {
        const { profile } = this.props;
        const { checked } = this.state;

        /*eslint-disable camelcase*/
        return (
            <React.Fragment>
                <Checkbox
                    label={ profile.captured_date === 'Latest'
                        ? profile.captured_date
                        : moment.utc(profile.captured_date).format('DD MMM YYYY, HH:mm UTC')
                    }
                    isChecked={ checked }
                    onChange={ this.handleChange }
                    aria-label={ profile.id }
                    id={ profile.id }
                    name={ profile.id }
                />
            </React.Fragment>
        );
        /*eslint-enable camelcase*/
    }
}

HistoricalProfilesCheckbox.propTypes = {
    profile: PropTypes.object,
    selectHistoricProfiles: PropTypes.func,
    selectedHSPIds: PropTypes.array,
    updateBadgeCount: PropTypes.func,
    selectSystem: PropTypes.func,
    entities: PropTypes.object,
    onSelect: PropTypes.func
};

function mapStateToProps(state) {
    return {
        selectedHSPIds: state.historicProfilesState.selectedHSPIds,
        entities: state.entities
    };
}

export default (connect(mapStateToProps, null)(HistoricalProfilesCheckbox));
