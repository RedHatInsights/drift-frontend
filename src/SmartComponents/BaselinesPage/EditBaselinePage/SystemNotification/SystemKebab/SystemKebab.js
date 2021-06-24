import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, KebabToggle, DropdownItem, DropdownPosition } from '@patternfly/react-core';

export class SystemKebab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            kebabOpened: false
        };

        this.toggleKebab = () => {
            const { kebabOpened } = this.state;

            this.setState({ kebabOpened: !kebabOpened });
        };
    }

    buildDropdownItems = () => {
        const { deleteNotifications, systemIds } = this.props;
        let dropdownItems = [];

        dropdownItems.push(
            <DropdownItem
                key="delete-baseline-notification"
                component="button"
                data-ouia-component-id={ 'delete-system-association-dropdown-item' + systemIds }
                onClick={ () => deleteNotifications(systemIds) }
            >
                Delete associated system
            </DropdownItem>
        );

        return dropdownItems;
    }

    render() {
        const { kebabOpened } = this.state;
        const { systemIds } = this.props;

        return (
            <React.Fragment>
                <Dropdown
                    style={{ float: 'right' }}
                    toggle={ <KebabToggle
                        data-ouia-component-id={ 'system-association-dropdown-toggle-' + systemIds }
                        data-ouia-component-type='PF4/DropdownToggle'
                        onToggle={ () => this.toggleKebab() } /> }
                    isOpen={ kebabOpened }
                    dropdownItems={ this.buildDropdownItems() }
                    isPlain
                    ouiaId={ 'system-notification-dropdown-' + systemIds }
                    position={ DropdownPosition.right }
                />
            </React.Fragment>
        );
    }
}

SystemKebab.propTypes = {
    systemIds: PropTypes.array,
    deleteNotifications: PropTypes.func
};

export default SystemKebab;
