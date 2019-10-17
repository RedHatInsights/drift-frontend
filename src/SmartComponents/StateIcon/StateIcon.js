import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon, QuestionCircleIcon, TimesCircleIcon } from '@patternfly/react-icons';

class StateIcon extends Component {
    constructor(props) {
        super(props);
    }

    icon() {
        let iconClass = '';

        if (this.props.factState === 'SAME') {
            iconClass = <CheckCircleIcon color='green'/>;
        } else if (this.props.factState === 'DIFFERENT') {
            iconClass = <TimesCircleIcon color='red'/>;
        } else {
            iconClass = <QuestionCircleIcon />;
        }

        return iconClass;
    };

    render() {
        return (
            this.icon()
        );
    }
}

StateIcon.propTypes = {
    factState: PropTypes.string
};

export default StateIcon;
