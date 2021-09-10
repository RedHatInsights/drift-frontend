import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon, QuestionCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';

class StateIcon extends Component {
    constructor(props) {
        super(props);
    }

    icon() {
        let iconClass = '';

        if (this.props.fact.state === 'SAME') {
            iconClass = <CheckCircleIcon color='#3E8635' height='16px' width='16px'/>;
        } else if (this.props.fact.state === 'DIFFERENT') {
            iconClass = <ExclamationCircleIcon color='#C9190B' height='16px' width='16px'/>;
        } else {
            iconClass = <QuestionCircleIcon color='#6A6E73' height='16px' width='16px'/>;
        }

        return iconClass;
    };

    render() {
        const { fact, stateSort } = this.props;

        return (
            <Tooltip
                key={ fact.name + '-' + stateSort }
                position="top"
                content={ <div>{ fact.tooltip }</div> }
            >
                { this.icon() }
            </Tooltip>
        );
    }
}

StateIcon.propTypes = {
    fact: PropTypes.object,
    stateSort: PropTypes.string
};

export default StateIcon;
