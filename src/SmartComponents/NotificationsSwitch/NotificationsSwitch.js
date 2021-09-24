import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@patternfly/react-core';

function NotificationsSwitch(props) {
    const { baselineData, classname, isChecked, handleNotificationToggle, hasLabel } = props;

    return (
        <Switch
            className={ classname }
            aria-label='notifications-toggle'
            isChecked={ isChecked }
            onChange={ () => handleNotificationToggle(baselineData) }
            labelOff={ hasLabel ? 'Notifications are disabled' : null }
            label={ hasLabel ? 'Notifications are enabled' : null }
            isReversed
            isDisabled={ baselineData.associated_systems === 0 }
        />
    );
}

NotificationsSwitch.propTypes = {
    baselineData: PropTypes.object,
    classname: PropTypes.string,
    handleNotificationToggle: PropTypes.func,
    hasLabel: PropTypes.bool,
    isChecked: PropTypes.bool
};

export default NotificationsSwitch;
