import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@patternfly/react-core';

export class NotificationDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { index, badgeCount, hasBadge } = this.props;

        return (
            <React.Fragment>
                {
                    hasBadge
                        ? <Badge key={ index } isRead>{ badgeCount }</Badge>
                        : null
                }
            </React.Fragment>
        );
    }
}

NotificationDetails.propTypes = {
    badgeCount: PropTypes.number,
    index: PropTypes.number,
    hasBadge: PropTypes.bool
};

export default NotificationDetails;
