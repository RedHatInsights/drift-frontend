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
            iconClass = <CheckCircleIcon color='#3E8635' height='16px' width='16px'/>;
        } else if (this.props.factState === 'DIFFERENT') {
            iconClass = <ExclamationCircleIcon color='#C9190B' height='16px' width='16px'/>;
        } else {
            iconClass = <QuestionCircleIcon color='#151515' height='16px' width='16px'/>;
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
