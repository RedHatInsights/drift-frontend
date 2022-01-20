import React from 'react';
import PropTypes from 'prop-types';
import { ToolbarFilter } from '@patternfly/react-core';
import SearchBar from '../../SearchBar/SearchBar';
import FilterDropDown from '../../FilterDropDown/FilterDropDown';

function DriftFilterValue(props) {
    const { activeFactFilters, factFilter, filterByFact, filterType, handleFactFilter, removeChip, setHistory, stateFilters } = props;

    const setFactFilterChips = () => {
        let factFilterChips = [ ...activeFactFilters ];

        if (factFilter.length && !activeFactFilters.includes(factFilter)) {
            factFilterChips.push(factFilter);
        }

        return factFilterChips;
    };

    const setStateChips = (stateFilters) => {
        let stateChips = [];

        stateFilters.forEach(function(filter) {
            if (filter.selected) {
                stateChips.push(filter.display);
            }
        });

        return stateChips;
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
            { /*<ToolbarFilter
                chips={ setFactTypeChips() }
                deleteChip={ removeChip }
                deleteChipGroup={ removeChip }
                categoryName="Fact type"
            >
                { type === 'Fact type' ? }
            </ToolbarFilter>*/ }
            <ToolbarFilter
                chips={ setStateChips(stateFilters) }
                deleteChip={ removeChip }
                deleteChipGroup={ removeChip }
                categoryName="State"
            >
                { type === 'State' ? <FilterDropDown setHistory={ setHistory } /> : null }
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
    factFilter: PropTypes.string,
    filterByFact: PropTypes.func,
    filterType: PropTypes.string,
    handleFactFilter: PropTypes.func,
    removeChip: PropTypes.func,
    setHistory: PropTypes.func,
    stateFilters: PropTypes.array
};

export default DriftFilterValue;
