import React from 'react';
import { useSelector } from 'react-redux';
import { Checkbox } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import moment from 'moment';

const HistoricalProfilesCheckbox = ({ onSelect, profile, selectedHSPIds, updateBadgeCount }) => {
    const entities = useSelector(
        (state) => state.entities
    );

    const findChecked = () => {
        let checked;

        if (profile.captured_date === 'Latest') {
            checked = entities.selectedSystemIds.some(id => id === profile.id);
            updateBadgeCount(checked);
        } else {
            checked = selectedHSPIds?.some(id => id === profile.id);
        }

        return checked;
    };

    /*eslint-disable camelcase*/
    return (
        <Checkbox
            label={ profile?.captured_date === 'Latest'
                ? profile.captured_date
                : moment.utc(profile.captured_date).format('DD MMM YYYY, HH:mm UTC') }
            isChecked={ findChecked() }
            onChange={ () => onSelect(!findChecked(), profile) }
            aria-label={ profile.id }
            id={ profile.id }
            name={ profile.id }
            data-ouia-component-id={ 'hsp-popover-option-checkbox-' + profile.id }
            data-ouia-component-type='PF4/Checkbox'
        />
    );
    /*eslint-enable camelcase*/
};

HistoricalProfilesCheckbox.propTypes = {
    profile: PropTypes.object,
    selectHistoricProfiles: PropTypes.func,
    selectedHSPIds: PropTypes.array,
    updateBadgeCount: PropTypes.func,
    selectSystem: PropTypes.func,
    entities: PropTypes.object,
    onSelect: PropTypes.func
};

export default HistoricalProfilesCheckbox;
