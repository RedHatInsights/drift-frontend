import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { DropdownItem, Toolbar, ToolbarGroup, ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { BulkSelect, ConditionalFilter } from '@redhat-cloud-services/frontend-components';

import CreateBaselineButton from '../../BaselinesPage/CreateBaselineButton/CreateBaselineButton';
import ExportCSVButton from '../../BaselinesPage/ExportCSVButton/ExportCSVButton';
import ActionKebab from '../../DriftPage/ActionKebab/ActionKebab';
import DeleteBaselinesModal from '../../BaselinesPage/DeleteBaselinesModal/DeleteBaselinesModal';
import BaselinesFilterChips from '../BaselinesFilterChips/BaselinesFilterChips';
import helpers from '../../helpers';
import { TablePagination } from '../../Pagination/Pagination';

export class BaselinesToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameSearch: '',
            modalOpened: false,
            bulkSelectItems: [
                {
                    title: 'Select all',
                    key: 'select-all',
                    onClick: () => this.props.onBulkSelect(true)
                }, {
                    title: 'Select none',
                    key: 'select-none',
                    onClick: () => this.props.onBulkSelect(false)
                }
            ]
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
    }

    async clearFilters() {
        const { onSearch } = this.props;

        this.setState({
            nameSearch: ''
        });

        onSearch('');
    }

    buildDropdownList = () => {
        const { isDisabled } = this.props;
        let actionKebabItems = [];

        actionKebabItems.push(<DropdownItem
            key="multi-delete"
            component="button"
            onClick={ this.toggleModal }
            isDisabled={ isDisabled }
        >
            Delete baselines
        </DropdownItem>);

        return actionKebabItems;
    }

    toggleModal = () => {
        const { modalOpened } = this.state;

        this.setState({
            modalOpened: !modalOpened
        });
    }

    setTextFilter = (value) => {
        this.setState({ nameSearch: value });
        this.handleSearch(value);
    }

    clearTextFilter = () => {
        this.setState({ nameSearch: '' });
        this.handleSearch('');
    }

    handleSearch = debounce(function(search) {
        this.props.onSearch(search);
    }, 250)

    render() {
        const { createButton, exportButton, fetchWithParams,
            hasMultiSelect, kebab, onBulkSelect, tableData, tableId,
            page, perPage, totalBaselines, updatePagination } = this.props;
        const { bulkSelectItems, modalOpened, nameSearch } = this.state;
        let selected = tableData.filter(baseline => baseline.selected === true).length;

        return (
            <React.Fragment>
                <DeleteBaselinesModal
                    modalOpened={ modalOpened }
                    tableId={ tableId }
                    fetchWithParams={ fetchWithParams }
                    toggleModal={ this.toggleModal }
                />
                <Toolbar className="drift-toolbar">
                    <ToolbarContent>
                        { hasMultiSelect
                            ? <ToolbarGroup variant='filter-group'>
                                <ToolbarItem>
                                    <BulkSelect
                                        count={ selected > 0 ? selected : null }
                                        items={ bulkSelectItems }
                                        checked={ helpers.findCheckedValue(tableData.length, selected) }
                                        onSelect={ () => onBulkSelect(!selected > 0) }
                                        isDisabled={ tableData.length === 0 }
                                    />
                                </ToolbarItem>
                            </ToolbarGroup>
                            : null
                        }
                        <ToolbarGroup variant='filter-group'>
                            <ToolbarItem>
                                <ConditionalFilter
                                    placeholder="Filter by name"
                                    value={ nameSearch }
                                    onChange={ (event, value) => this.setTextFilter(value) }
                                />
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup variant='button-group'>
                            { createButton ?
                                <ToolbarItem>
                                    <CreateBaselineButton />
                                </ToolbarItem>
                                : null
                            }
                        </ToolbarGroup>
                        <ToolbarGroup variant='icon-button-group'>
                            { exportButton ?
                                <ToolbarItem>
                                    <ExportCSVButton exportType='baseline list'/>
                                </ToolbarItem>
                                : null
                            }
                            { kebab ?
                                <ToolbarItem>
                                    <ActionKebab dropdownItems={ this.buildDropdownList() } />
                                </ToolbarItem>
                                : null
                            }
                        </ToolbarGroup>
                        <ToolbarItem variant="pagination">
                            <TablePagination
                                page={ page }
                                perPage={ perPage }
                                total={ totalBaselines }
                                isCompact={ true }
                                updatePagination={ updatePagination }
                                tableId={ tableId }
                            />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
                { nameSearch.length > 0 ?
                    <Toolbar>
                        <ToolbarContent>
                            <ToolbarGroup>
                                <ToolbarItem>
                                    <BaselinesFilterChips
                                        nameSearch={ nameSearch }
                                        clearTextFilter={ this.clearTextFilter }
                                    />
                                </ToolbarItem>
                                <ToolbarItem>
                                    <a onClick={ () => this.clearFilters() } >
                                        Clear filters
                                    </a>
                                </ToolbarItem>
                            </ToolbarGroup>
                        </ToolbarContent>
                    </Toolbar>
                    : null
                }
            </React.Fragment>
        );
    }
}

BaselinesToolbar.propTypes = {
    createButton: PropTypes.bool,
    exportButton: PropTypes.bool,
    kebab: PropTypes.bool,
    fetchWithParams: PropTypes.func,
    onSearch: PropTypes.func,
    tableId: PropTypes.string,
    tableData: PropTypes.array,
    onBulkSelect: PropTypes.func,
    hasMultiSelect: PropTypes.bool,
    clearSort: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    isDisabled: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalBaselines: PropTypes.number,
    updatePagination: PropTypes.func
};

export default BaselinesToolbar;
