import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon, QuestionCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

class StateIcon extends Component {
    constructor(props) {
        super(props);
    }

    icon() {
        let iconClass = '';

        if (this.props.factState === 'SAME') {
            iconClass = <CheckCircleIcon color='green' height='20px' width='20px'/>;
        } else if (this.props.factState === 'DIFFERENT') {
            iconClass = <ExclamationCircleIcon color='red' height='20px' width='20px'/>;
        } else {
            iconClass = <QuestionCircleIcon height='20px' width='20px'/>;
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
