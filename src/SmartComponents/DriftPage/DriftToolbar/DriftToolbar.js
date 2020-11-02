import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DropdownItem, PaginationVariant, Toolbar, ToolbarGroup, ToolbarItem, ToolbarContent } from '@patternfly/react-core';

import FilterDropDown from '../FilterDropDown/FilterDropDown';
import SearchBar from '../SearchBar/SearchBar';
import ActionKebab from '../ActionKebab/ActionKebab';
import AddSystemButton from '../AddSystemButton/AddSystemButton';
import ExportCSVButton from '../../ExportCSVButton/ExportCSVButton';
import DriftFilterChips from '../DriftFilterChips/DriftFilterChips';
import { setHistory } from '../../../Utilities/SetHistory';
import { TablePagination } from '../../Pagination/Pagination';

export class DriftToolbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            actionKebabItems: [
                <DropdownItem key="remove-systems" component="button" onClick={ this.clearComparison }>Clear all comparisons</DropdownItem>
            ],
            dropdownItems: [
                <DropdownItem
                    key='export-to-CSV'
                    component='button'
                    onClick={ () => this.props.exportToCSV() }
                >
                    Export to CSV
                </DropdownItem>
            ],
            isEmpty: true,
            dropdownOpen: false
        };
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

    clearFilters = () => {
        const { clearComparisonFilters } = this.props;

        clearComparisonFilters();
    }

    clearComparison = () => {
        const { history, clearComparison, clearSelectedBaselines, setIsFirstReference, updateReferenceId } = this.props;

        clearComparison();
        clearSelectedBaselines('CHECKBOX');
        setIsFirstReference(true);
        updateReferenceId();
        setHistory(history, []);
    }

    render() {
        const { loading, page, perPage, totalFacts, updatePagination } = this.props;
        const { actionKebabItems, dropdownItems, dropdownOpen, isEmpty } = this.state;

        return (
            <React.Fragment>
                <Toolbar className="drift-toolbar">
                    <ToolbarContent>
                        <ToolbarGroup variant='filter-group'>
                            <ToolbarItem>
                                <SearchBar />
                            </ToolbarItem>
                            <ToolbarItem>
                                <FilterDropDown />
                            </ToolbarItem>
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
                                    isOpen={ dropdownOpen }
                                    onToggle={ this.onToggle }
                                />
                            </ToolbarItem>
                            <ToolbarItem>
                                <ActionKebab dropdownItems={ actionKebabItems } />
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarItem variant='pagination' align={ { default: 'alignRight' } }>
                            <TablePagination
                                page={ page }
                                perPage={ perPage }
                                total={ totalFacts }
                                isCompact={ true }
                                updatePagination={ updatePagination }
                                widgetId='drift-pagination-top'
                                variant={ PaginationVariant.top }
                            />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
                <Toolbar className="drift-toolbar">
                    <ToolbarContent>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <DriftFilterChips setIsEmpty={ this.setIsEmpty } />
                            </ToolbarItem>
                            { !isEmpty
                                ? <ToolbarItem>
                                    <a onClick={ () => this.clearFilters() } >
                                        Clear filters
                                    </a>
                                </ToolbarItem>
                                : null
                            }
                        </ToolbarGroup>
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
    updateReferenceId: PropTypes.func
};

export default DriftToolbar;
