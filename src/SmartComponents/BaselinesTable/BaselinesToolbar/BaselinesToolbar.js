import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { ConditionalFilter } from '@redhat-cloud-services/frontend-components';

import CreateBaselineButton from '../../BaselinesPage/CreateBaselineButton/CreateBaselineButton';
import ExportCSVButton from '../../BaselinesPage/ExportCSVButton/ExportCSVButton';
import BaselinesKebab from '../../BaselinesPage/BaselinesKebab/BaselinesKebab';
import BaselinesFilterChips from '../BaselinesFilterChips/BaselinesFilterChips';

class BaselinesToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameSearch: ''
        };

        this.handleSearch = this.handleSearch.bind(this);
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
        const { createButton, exportButton, kebab } = this.props;
        const { nameSearch } = this.state;

        return (
            <React.Fragment>
                <Toolbar className="drift-toolbar">
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
                                <BaselinesKebab exportType='baseline list'/>
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
    fetchBaselines: PropTypes.func,
    onSearch: PropTypes.func
};

export default BaselinesToolbar;
