import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@patternfly/react-core';
import NotificationsSwitch from '../../NotificationsSwitch/NotificationsSwitch';
import helpers from '../../BaselinesPage/EditBaselinePage/redux/helpers';

function NotificationDetails(props) {
    const { badgeCount, baselineData, classname, hasBadge, hasLabel, hasSwitch, index, notificationsSwitchError,
        toggleNotificationPending, toggleNotificationFulfilled, toggleNotificationRejected } = props;
    const [ isChecked, toggleChecked ] = useState(baselineData.notifications_enabled);

    useEffect(() => {
        if (notificationsSwitchError?.id === baselineData.id) {
            toggleChecked(!isChecked);
        }
    }, [ notificationsSwitchError ]);

    /*eslint-disable camelcase*/
    const handleNotificationToggle = (baselineData) => {
        let apiBody = {
            display_name: baselineData.display_name,
            facts_patch: [],
            notifications_enabled: !isChecked
        };

        helpers.toggleNotificationSwitch(
            baselineData.id, apiBody, toggleNotificationPending, toggleNotificationFulfilled, toggleNotificationRejected
        );
        toggleChecked(!isChecked);
    };
    /*eslint-enable camelcase*/

    return (
        <React.Fragment>
            { hasSwitch
                ? <NotificationsSwitch
                    classname={ classname }
                    isChecked={ isChecked }
                    hasLabel={ hasLabel }
                    handleNotificationToggle={ handleNotificationToggle }
                    baselineData={ baselineData }
                />
                : null
            }
            {
                hasBadge
                    ? <Badge
                        key={ index }
                        isRead={ badgeCount > 0 ? null : true }
                    >
                        { badgeCount }
                    </Badge>
                    : null
            }
        </React.Fragment>
    );
}

NotificationDetails.propTypes = {
    badgeCount: PropTypes.number,
    baselineData: PropTypes.object,
    classname: PropTypes.string,
    hasBadge: PropTypes.bool,
    hasLabel: PropTypes.bool,
    hasSwitch: PropTypes.bool,
    index: PropTypes.number,
    notificationsSwitchError: PropTypes.object,
    toggleNotificationPending: PropTypes.func,
    toggleNotificationFulfilled: PropTypes.func,
    toggleNotificationRejected: PropTypes.func
};

export default NotificationDetails;
