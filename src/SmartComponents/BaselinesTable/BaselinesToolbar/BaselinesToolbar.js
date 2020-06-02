import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { BulkSelect, ConditionalFilter } from '@redhat-cloud-services/frontend-components';

import CreateBaselineButton from '../../BaselinesPage/CreateBaselineButton/CreateBaselineButton';
import ExportCSVButton from '../../BaselinesPage/ExportCSVButton/ExportCSVButton';
import BaselinesKebab from '../../BaselinesPage/BaselinesKebab/BaselinesKebab';
import BaselinesFilterChips from '../BaselinesFilterChips/BaselinesFilterChips';

export class BaselinesToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameSearch: '',
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
        const { clearSort, fetchWithParams } = this.props;

        this.setState({
            nameSearch: ''
        });

        await clearSort();
        fetchWithParams();
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
        const { clearSort, createButton, exportButton, fetchWithParams,
            hasMultiSelect, kebab, onBulkSelect, tableData, tableId } = this.props;
        const { bulkSelectItems, nameSearch } = this.state;
        let selected = tableData.filter(baseline => baseline.selected === true).length;

        return (
            <React.Fragment>
                <Toolbar className="drift-toolbar">
                    { hasMultiSelect
                        ? <ToolbarGroup>
                            <ToolbarItem>
                                <BulkSelect
                                    count={ selected > 0 ? selected : null }
                                    items={ bulkSelectItems }
                                    checked={ selected > 0 ? true : false }
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
                                <BaselinesKebab
                                    exportType='baseline list'
                                    tableId={ tableId }
                                    fetchWithParams={ fetchWithParams }
                                    clearFilters={ clearSort || nameSearch !== '' ? this.clearFilters : false }
                                />
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
    clearSort: PropTypes.func
};

export default BaselinesToolbar;
