import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ToolbarGroup } from '@patternfly/react-core';

import DriftFilterDropdown from './DriftFilterDropdown';
import DriftFilterValue from './DriftFilterValue';

function DriftFilter(props) {
    const { activeFactFilters, addStateFilter, factFilter, factTypeFilters, filterByFact, handleFactFilter, removeChip,
        setHistory, stateFilters, toggleFactTypeFilter } = props;
    const [ filterType, toggleFilterType ] = useState('Fact name');

    return (
        <ToolbarGroup variant='filter-group'>
            <DriftFilterDropdown
                filterType={ filterType }
                toggleFilterType={ toggleFilterType }
            />
            <DriftFilterValue
                activeFactFilters={ activeFactFilters }
                addStateFilter={ addStateFilter }
                factFilter={ factFilter }
                factTypeFilters={ factTypeFilters }
                filterByFact={ filterByFact }
                filterType={ filterType }
                handleFactFilter={ handleFactFilter }
                removeChip={ removeChip }
                setHistory={ setHistory }
                stateFilters={ stateFilters }
                toggleFactTypeFilter={ toggleFactTypeFilter }
            />
        </ToolbarGroup>
    );
}

DriftFilter.propTypes = {
    activeFactFilters: PropTypes.array,
    addStateFilter: PropTypes.func,
    clearAllFactFilters: PropTypes.func,
    clearAllStateChips: PropTypes.func,
    factFilter: PropTypes.string,
    factTypeFilters: PropTypes.array,
    filterByFact: PropTypes.func,
    handleFactFilter: PropTypes.func,
    removeChip: PropTypes.func,
    setHistory: PropTypes.func,
    stateFilters: PropTypes.array,
    toggleFactTypeFilter: PropTypes.func
};

export default DriftFilter;
