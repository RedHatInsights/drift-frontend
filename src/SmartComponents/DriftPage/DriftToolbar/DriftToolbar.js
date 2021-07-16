import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DropdownItem, PaginationVariant, Toolbar, ToolbarGroup, ToolbarItem,
    ToolbarContent, ToolbarFilter } from '@patternfly/react-core';

import FilterDropDown from '../FilterDropDown/FilterDropDown';
import SearchBar from '../SearchBar/SearchBar';
import ActionKebab from '../ActionKebab/ActionKebab';
import AddSystemButton from '../AddSystemButton/AddSystemButton';
import ExportCSVButton from '../../ExportCSVButton/ExportCSVButton';
import { TablePagination } from '../../Pagination/Pagination';

export class DriftToolbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            actionKebabItems: [
                <DropdownItem
                    key="remove-systems"
                    component="button"
                    data-ouia-component-id='clear-all-comparisons-dropdown-item'
                    onClick={ this.clearComparison }>Clear all comparisons</DropdownItem>
            ],
            dropdownItems: [
                <DropdownItem
                    key='export-to-CSV'
                    component='button'
                    data-ouia-component-id='export-to-csv-dropdown-item-comparison'
                    onClick={ () => this.props.exportToCSV() }
                >
                    Export to CSV
                </DropdownItem>
            ],
            isEmpty: true,
            dropdownOpen: false
        };
    }

    setFactFilterChips = () => {
        const { activeFactFilters, factFilter } = this.props;
        let factFilterChips = [ ...activeFactFilters ];

        if (factFilter.length && !activeFactFilters.includes(factFilter)) {
            factFilterChips.push(factFilter);
        }

        return factFilterChips;
    }

    setStateChips = (stateFilters) => {
        let stateChips = [];

        stateFilters.forEach(function(filter) {
            if (filter.selected) {
                stateChips.push(filter.display);
            }
        });

        return stateChips;
    }

    clearAllStateChips = async () => {
        const { addStateFilter, stateFilters } = this.props;

        stateFilters.forEach(function(stateFilter) {
            stateFilter.selected = true;
            addStateFilter(stateFilter);
        });
    }

    removeChip = async (type = '', id = '') => {
        const { activeFactFilters, addStateFilter, clearAllFactFilters, filterByFact, handleFactFilter, setHistory, stateFilters } = this.props;

        if (type === 'State') {
            if (id === '') {
                this.clearAllStateChips();
            } else {
                stateFilters.forEach(async function(stateFilter) {
                    if (stateFilter.display === id) {
                        await addStateFilter(stateFilter);
                    }
                });
            }
        } else {
            if (id === '') {
                await clearAllFactFilters();
            } else if (activeFactFilters.includes(id)) {
                await handleFactFilter(id);
            } else {
                await filterByFact('');
            }
        }

        setHistory();
    }

    setIsEmpty = (isEmpty) => {
        this.setState({ isEmpty });
    }

    onToggle = () => {
        const { dropdownOpen } = this.state;

        this.setState({
            dropdownOpen: !dropdownOpen
        });
    }

    clearFilters = async () => {
        const { clearComparisonFilters, setHistory } = this.props;

        await clearComparisonFilters();
        setHistory();
    }

    clearComparison = async () => {
        const { clearComparison, clearSelectedBaselines, setHistory, setIsFirstReference, updateReferenceId } = this.props;

        await clearComparison();
        await clearSelectedBaselines('COMPARISON');
        await setIsFirstReference(true);
        await updateReferenceId();
        setHistory();

    }

    render() {
        const { activeFactFilters, factFilter, filterByFact, handleFactFilter, loading, page, perPage,
            resetComparisonFilters, setHistory, stateFilters, totalFacts, updatePagination } = this.props;
        const { actionKebabItems, dropdownItems, dropdownOpen } = this.state;

        return (
            <React.Fragment>
                <Toolbar className="drift-toolbar" clearAllFilters={ resetComparisonFilters } clearFiltersButtonText='Reset filters'>
                    <ToolbarContent>
                        <ToolbarGroup variant='filter-group'>
                            <ToolbarFilter
                                chips={ this.setFactFilterChips() }
                                deleteChip={ this.removeChip }
                                deleteChipGroup={ this.removeChip }
                                categoryName="Fact name"
                            >
                                <SearchBar
                                    factFilter={ factFilter }
                                    activeFactFilters={ activeFactFilters }
                                    handleFactFilter={ handleFactFilter }
                                    filterByFact={ filterByFact }
                                    setHistory={ setHistory }
                                />
                            </ToolbarFilter>
                            <ToolbarFilter
                                chips={ this.setStateChips(stateFilters) }
                                deleteChip={ this.removeChip }
                                deleteChipGroup={ this.removeChip }
                                categoryName="State"
                            >
                                <FilterDropDown setHistory={ setHistory } />
                            </ToolbarFilter>
                        </ToolbarGroup>
                        <ToolbarGroup variant='button-group'>
                            <ToolbarItem>
                                <AddSystemButton loading={ loading } />
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup variant='icon-button-group'>
                            <ToolbarItem>
                                <ExportCSVButton
                                    dropdownItems={ dropdownItems }
                                    ouiaId='export-dropdown-comparison'
                                    isOpen={ dropdownOpen }
                                    onToggle={ this.onToggle }
                                />
                            </ToolbarItem>
                            <ToolbarItem>
                                <ActionKebab
                                    ouiaId='clear-comparison-dropdown'
                                    dropdownItems={ actionKebabItems } />
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarItem variant='pagination' align={{ default: 'alignRight' }}>
                            <TablePagination
                                page={ page }
                                perPage={ perPage }
                                total={ totalFacts }
                                isCompact={ true }
                                updatePagination={ updatePagination }
                                widgetId='drift-pagination-top'
                                ouiaId='comparison-pagination-top'
                                variant={ PaginationVariant.top }
                            />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
            </React.Fragment>
        );
    }
}

DriftToolbar.propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalFacts: PropTypes.number,
    updatePagination: PropTypes.func,
    clearComparisonFilters: PropTypes.func,
    clearComparison: PropTypes.func,
    exportToCSV: PropTypes.func,
    clearSelectedBaselines: PropTypes.func,
    setIsFirstReference: PropTypes.func,
    updateReferenceId: PropTypes.func,
    factFilter: PropTypes.string,
    filterByFact: PropTypes.func,
    stateFilters: PropTypes.array,
    addStateFilter: PropTypes.func,
    activeFactFilters: PropTypes.array,
    handleFactFilter: PropTypes.func,
    clearAllFactFilters: PropTypes.func,
    setHistory: PropTypes.func,
    resetComparisonFilters: PropTypes.func
};

export default DriftToolbar;
