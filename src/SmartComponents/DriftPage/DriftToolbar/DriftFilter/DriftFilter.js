import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ToolbarGroup } from '@patternfly/react-core';

import DriftFilterDropdown from './DriftFilterDropdown';
import DriftFilterValue from './DriftFilterValue';

function DriftFilter(props) {
    const { activeFactFilters, factFilter, filterByFact, handleFactFilter, removeChip, setHistory, stateFilters } = props;
    const [ filterType, toggleFilterType ] = useState('Fact name');

    return (
        <ToolbarGroup variant='filter-group'>
            <DriftFilterDropdown
                filterType={ filterType }
                toggleFilterType={ toggleFilterType }
            />
            <DriftFilterValue
                activeFactFilters={ activeFactFilters }
                factFilter={ factFilter }
                filterByFact={ filterByFact }
                filterType={ filterType }
                handleFactFilter={ handleFactFilter }
                removeChip={ removeChip }
                setHistory={ setHistory }
                stateFilters={ stateFilters }
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
    filterByFact: PropTypes.func,
    handleFactFilter: PropTypes.func,
    removeChip: PropTypes.func,
    setHistory: PropTypes.func,
    stateFilters: PropTypes.array
};

export default DriftFilter;
