import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, KebabToggle } from '@patternfly/react-core';

class ActionKebab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            kebabOpened: false
        };

        this.toggleKebab = () => {
            const { kebabOpened } = this.state;

            this.setState({
                kebabOpened: !kebabOpened
            });
        };
    }

    render() {
        const { dropdownItems, ouiaId } = this.props;
        const { kebabOpened } = this.state;

        return (
            <Dropdown
                id='action-kebab'
                aria-label='action-kebab'
                style={{ float: 'left' }}
                ouiaId = { ouiaId || 'action-kebab' }
                toggle={ <KebabToggle
                    data-ouia-component-type='PF4/DropdownToggle'
                    data-ouia-component-id={ ouiaId ? ouiaId + '-toggle' : 'action-kebab-toggle' }
                    onToggle={ this.toggleKebab } /> }
                isOpen={ kebabOpened }
                dropdownItems={ dropdownItems }
                isPlain
            />
        );
    }
}

ActionKebab.propTypes = {
    dropdownItems: PropTypes.array,
    ouiaId: PropTypes.string
};

export default ActionKebab;
