import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { DropdownItem, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { BulkSelect, ConditionalFilter } from '@redhat-cloud-services/frontend-components';

import CreateBaselineButton from '../../BaselinesPage/CreateBaselineButton/CreateBaselineButton';
import ExportCSVButton from '../../BaselinesPage/ExportCSVButton/ExportCSVButton';
import ActionKebab from '../../DriftPage/ActionKebab/ActionKebab';
import DeleteBaselinesModal from '../../BaselinesPage/DeleteBaselinesModal/DeleteBaselinesModal';
import BaselinesFilterChips from '../BaselinesFilterChips/BaselinesFilterChips';
import helpers from '../../helpers';

export class BaselinesToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameSearch: '',
            deleteModalOpened: false,
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
        const { deleteModalOpened } = this.state;

        this.setState({
            deleteModalOpened: !deleteModalOpened
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
            hasMultiSelect, kebab, onBulkSelect, tableData, tableId } = this.props;
        const { bulkSelectItems, deleteModalOpened, nameSearch } = this.state;
        let selected = tableData.filter(baseline => baseline.selected === true).length;

        return (
            <React.Fragment>
                { deleteModalOpened
                    ? <DeleteBaselinesModal
                        modalOpened={ true }
                        tableId={ tableId }
                        fetchWithParams={ fetchWithParams }
                    />
                    : null
                }
                <Toolbar className="drift-toolbar">
                    { hasMultiSelect
                        ? <ToolbarGroup>
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
                    <ToolbarGroup>
                        <ToolbarItem>
                            <ConditionalFilter
                                placeholder="Filter by name"
                                value={ nameSearch }
                                onChange={ (event, value) => this.setTextFilter(value) }
                            />
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        { createButton ?
                            <ToolbarItem>
                                <CreateBaselineButton />
                            </ToolbarItem>
                            : null
                        }
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
                </Toolbar>
                { nameSearch.length > 0 ?
                    <Toolbar className="drift-toolbar">
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
    isDisabled: PropTypes.bool
};

export default BaselinesToolbar;
