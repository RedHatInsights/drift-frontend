import React from 'react';
import PropTypes from 'prop-types';
import { ToolbarFilter } from '@patternfly/react-core';
import SearchBar from '../../SearchBar/SearchBar';
import FilterDropDown from '../../FilterDropDown/FilterDropDown';

function DriftFilterValue(props) {
    const { activeFactFilters, addStateFilter, factFilter, factTypeFilters, filterByFact, filterType, handleFactFilter, removeChip,
        setHistory, stateFilters, toggleFactTypeFilter } = props;

    const setFactFilterChips = () => {
        let factFilterChips = [ ...activeFactFilters ];

        if (factFilter.length && !activeFactFilters.includes(factFilter)) {
            factFilterChips.push(factFilter);
        }

        return factFilterChips;
    };

    const setDropdownChips = (dropdownFilters) => {
        let chips = [];

        dropdownFilters.forEach(function(filter) {
            if (filter.selected && filter.display !== 'All facts') {
                chips.push(filter.display);
            }
        });

        return chips;
    };

    const renderFilterInput = (type) => {
        return <React.Fragment>
            <ToolbarFilter
                chips={ setFactFilterChips() }
                deleteChip={ removeChip }
                deleteChipGroup={ removeChip }
                categoryName="Fact name"
            >
                { type === 'Fact name'
                    ? <SearchBar
                        factFilter={ factFilter }
                        activeFactFilters={ activeFactFilters }
                        handleFactFilter={ handleFactFilter }
                        filterByFact={ filterByFact }
                        setHistory={ setHistory }
                    />
                    : null
                }
            </ToolbarFilter>
            <ToolbarFilter
                className='comparison-filter-input-dropdown-width'
                chips={ setDropdownChips(factTypeFilters) }
                deleteChip={ removeChip }
                categoryName="Fact type"
            >
                { type === 'Fact type'
                    ? <FilterDropDown
                        filterFunction={ toggleFactTypeFilter }
                        filters={ factTypeFilters }
                        setHistory={ setHistory }
                        type={ type }
                    />
                    : null
                }
            </ToolbarFilter>
            <ToolbarFilter
                className='comparison-filter-input-dropdown-width'
                chips={ setDropdownChips(stateFilters) }
                deleteChip={ removeChip }
                deleteChipGroup={ removeChip }
                categoryName="State"
            >
                { type === 'State'
                    ? <FilterDropDown
                        filterFunction={ addStateFilter }
                        filters={ stateFilters }
                        setHistory={ setHistory }
                        type={ type }
                    />
                    : null
                }
            </ToolbarFilter>
        </React.Fragment>;
    };

    return (
        <React.Fragment>
            { renderFilterInput(filterType) }
        </React.Fragment>
    );
}

DriftFilterValue.propTypes = {
    activeFactFilters: PropTypes.array,
    addStateFilter: PropTypes.func,
    factFilter: PropTypes.string,
    factTypeFilters: PropTypes.array,
    filterByFact: PropTypes.func,
    filterType: PropTypes.string,
    handleFactFilter: PropTypes.func,
    removeChip: PropTypes.func,
    setHistory: PropTypes.func,
    stateFilters: PropTypes.array,
    toggleFactTypeFilter: PropTypes.func
};

export default DriftFilterValue;
