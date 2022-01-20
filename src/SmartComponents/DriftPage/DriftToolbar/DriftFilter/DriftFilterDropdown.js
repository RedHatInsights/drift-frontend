import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';

function DriftFilterDropdown(props) {
    const { filterType, toggleFilterType } = props;
    const [ isOpen, toggleOpen ] = useState(false);

    const selectFilter = (type) => {
        toggleFilterType(type);
        toggleOpen(!isOpen);
    };

    const dropdownItems = [
        <DropdownItem
            data-ouia-component-id='fact-name-filter'
            key='fact-name'
            onClick={ () => selectFilter('Fact name') }
        >
            Fact name
        </DropdownItem>,
        // Using this code block for the next PR.
        /*<DropdownItem
            data-ouia-component-id='fact-type-filter'
            key='fact-type'
            onClick={ () => selectFilter('Fact type') }
        >
            Fact type
        </DropdownItem>,*/
        <DropdownItem
            data-ouia-component-id='state-filter'
            key='state'
            onClick={ () => selectFilter('State') }
        >
            State
        </DropdownItem>
    ];

    return (
        <Dropdown
            ouiaId='drift-filter-dropdown'
            className='comparison-filter-dropdown-width'
            toggle={ <DropdownToggle
                onToggle={ toggleOpen }
                ouiaId='drift-filter-toggle'
                icon={ <FilterIcon /> }>
                { filterType }
            </DropdownToggle> }
            isOpen={ isOpen }
            dropdownItems={ dropdownItems }
        />
    );
}

DriftFilterDropdown.propTypes = {
    filterType: PropTypes.string,
    toggleFilterType: PropTypes.func
};

export default DriftFilterDropdown;
