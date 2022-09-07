import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { DropdownItem, Toolbar, ToolbarFilter, ToolbarGroup, ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { BulkSelect, ConditionalFilter } from '@redhat-cloud-services/frontend-components';

import CreateBaselineButton from '../../BaselinesPage/CreateBaselineButton/CreateBaselineButton';
import ExportCSVButton from '../../ExportCSVButton/ExportCSVButton';
import ActionKebab from '../../DriftPage/ActionKebab/ActionKebab';
import DeleteBaselinesModal from '../../BaselinesPage/DeleteBaselinesModal/DeleteBaselinesModal';
import helpers from '../../helpers';
import { TablePagination } from '../../Pagination/Pagination';
import { bulkSelectItems, errorExportNotification, preparingExportNotification, successfulExportNotification } from '../../../constants';

export class BaselinesToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameSearch: '',
            modalOpened: false,
            dropdownOpen: false,
            dropdownItems: [
                <DropdownItem
                    key='export-to-CSV'
                    component='button'
                    data-ouia-component-id='export-to-csv-dropdown-item-baselines'
                    onClick={ () => this.prepareExport(this.props.exportToCSV) }
                >
                    Export to CSV
                </DropdownItem>,
                <DropdownItem
                    key='export-to-JSON'
                    component='button'
                    data-ouia-component-id='export-to-json-dropdown-item-baselines'
                    onClick={ () => this.prepareExport(this.props.exportToJSON) }
                >
                    Export to JSON
                </DropdownItem>
            ]
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { exportStatus, resetBaselinesExportStatus, store } = this.props;
        if (exportStatus === 'success' && prevProps.exportStatus !== 'success') {
            successfulExportNotification(store);
            resetBaselinesExportStatus();
        }

        if (exportStatus === 'failure' && prevProps.exportStatus !== 'failure') {
            errorExportNotification(store);
            resetBaselinesExportStatus();
        }
    }

    prepareExport = (exportFunc) => {
        const { store, tableData, tableId } = this.props;

        preparingExportNotification(store);

        exportFunc(tableId, tableData);
    }

    onToggle = () => {
        const { dropdownOpen } = this.state;

        this.setState({
            dropdownOpen: !dropdownOpen
        });
    }

    async clearFilters() {
        const { onSearch } = this.props;

        this.setState({
            nameSearch: ''
        });

        onSearch('');
    }

    buildDropdownList = () => {
        const { isDeleteDisabled } = this.props;
        let actionKebabItems = [];

        actionKebabItems.push(<DropdownItem
            key="multi-delete"
            data-ouia-component-id='delete-baselines-dropdown-item'
            component="button"
            onClick={ this.toggleModal }
            isDisabled={ isDeleteDisabled }
        >
            Delete selected baselines
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
        const { createButton, exportButton, fetchWithParams, hasMultiSelect, kebab, leftAlignToolbar, loading, onBulkSelect,
            tableData, tableId, page, permissions, perPage, selectedBaselineIds, totalBaselines, updatePagination } = this.props;
        const { dropdownItems, dropdownOpen, modalOpened, nameSearch } = this.state;

        return (
            <React.Fragment>
                <DeleteBaselinesModal
                    modalOpened={ modalOpened }
                    tableId={ tableId }
                    fetchWithParams={ fetchWithParams }
                    toggleModal={ this.toggleModal }
                    selectedBaselineIds={ selectedBaselineIds }
                />
                <Toolbar
                    className={ leftAlignToolbar ? 'baseline-toolbar' : null }
                    clearAllFilters={ this.clearFilters }>
                    <ToolbarContent>
                        { hasMultiSelect
                            ? <ToolbarGroup variant='filter-group'>
                                <ToolbarItem>
                                    <BulkSelect
                                        id='baselines-bulk-select'
                                        count={ selectedBaselineIds.length }
                                        items={ bulkSelectItems(onBulkSelect, tableData.length) }
                                        checked={ helpers.findCheckedValue(totalBaselines, selectedBaselineIds.length) }
                                        onSelect={ () => onBulkSelect('page') }
                                        isDisabled={ tableData.length === 0
                                            || (!permissions.baselinesWrite && kebab)
                                            || (!permissions.baselinesRead && !createButton) }
                                    />
                                </ToolbarItem>
                            </ToolbarGroup>
                            : null
                        }
                        <ToolbarGroup variant='filter-group'>
                            <ToolbarFilter
                                chips={ nameSearch !== '' ? [ nameSearch ] : [] }
                                deleteChip={ this.clearFilters }
                                categoryName="Baseline name"
                            >
                                <ConditionalFilter
                                    placeholder="Filter by name"
                                    value={ nameSearch }
                                    data-ouia-component-type='PF4/TextInput'
                                    data-ouia-component-id='filter-by-name-baselines-table'
                                    onChange={ (event, value) => this.setTextFilter(value) }
                                    isDisabled={ !permissions.baselinesRead }
                                />
                            </ToolbarFilter>
                        </ToolbarGroup>
                        <ToolbarGroup variant='button-group'>
                            { createButton ?
                                <ToolbarItem>
                                    <CreateBaselineButton
                                        loading={ loading }
                                        permissions={ permissions }
                                    />
                                </ToolbarItem>
                                : null
                            }
                        </ToolbarGroup>
                        <ToolbarGroup variant='icon-button-group'>
                            { exportButton ?
                                <ToolbarItem>
                                    <ExportCSVButton
                                        dropdownItems={ dropdownItems }
                                        ouiaId='export-dropdown-baselines'
                                        isOpen={ dropdownOpen }
                                        onToggle={ this.onToggle }
                                    />
                                </ToolbarItem>
                                : null
                            }
                            { kebab ?
                                <ToolbarItem>
                                    <ActionKebab
                                        ouiaId='delete-baselines-dropdown'
                                        dropdownItems={ this.buildDropdownList() } />
                                </ToolbarItem>
                                : null
                            }
                        </ToolbarGroup>
                        <ToolbarItem variant="pagination">
                            <TablePagination
                                page={ page }
                                perPage={ perPage }
                                total={ !permissions.baselinesRead ? 0 : totalBaselines }
                                isCompact={ true }
                                updatePagination={ updatePagination }
                                tableId={ tableId }
                            />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
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
    isDeleteDisabled: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalBaselines: PropTypes.number,
    updatePagination: PropTypes.func,
    exportStatus: PropTypes.string,
    exportToCSV: PropTypes.func,
    exportToJSON: PropTypes.func,
    loading: PropTypes.bool,
    permissions: PropTypes.object,
    leftAlignToolbar: PropTypes.bool,
    resetBaselinesExportStatus: PropTypes.func,
    store: PropTypes.object
};

export default BaselinesToolbar;
