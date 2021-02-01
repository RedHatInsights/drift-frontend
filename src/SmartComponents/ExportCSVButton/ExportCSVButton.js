import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, DropdownToggle, DropdownPosition } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons';

class ExportCSVButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dropdownItems, isOpen, onToggle, ouiaId } = this.props;

        return (
            <Dropdown
                toggle={ <DropdownToggle
                    ouiaId={ ouiaId ? ouiaId + '-toggle' : 'action-kebab-toggle' }
                    toggleIndicator={ null }
                    onToggle={ onToggle }
                    ouiaId={ (ouiaId ? ouiaId : 'export-dropdown') + '-toggle' }>
                    <ExportIcon className='pointer not-active'/>
                </DropdownToggle> }
                isOpen={ isOpen }
                ouiaId = { ouiaId || 'export-dropdown' }
                isPlain
                position={ DropdownPosition.left }
                dropdownItems={ dropdownItems }
            />
        );
    }
}

ExportCSVButton.propTypes = {
    dropdownItems: PropTypes.array,
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    ouiaId: PropTypes.string
};

export default ExportCSVButton;
