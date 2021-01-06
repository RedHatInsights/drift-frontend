import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, DropdownToggle, DropdownPosition } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons';

class ExportCSVButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dropdownItems, isOpen, onToggle } = this.props;

        return (
            <Dropdown
                toggle={ <DropdownToggle
                    toggleIndicator={ null }
                    onToggle={ onToggle }>
                    <ExportIcon className='pointer not-active'/>
                </DropdownToggle> }
                isOpen={ isOpen }
                isPlain
                position={ DropdownPosition.left }
                dropdownItems={ dropdownItems }
                ouiaId="export"
            />
        );
    }
}

ExportCSVButton.propTypes = {
    dropdownItems: PropTypes.array,
    isOpen: PropTypes.bool,
    onToggle: PropTypes.func
};

export default ExportCSVButton;
