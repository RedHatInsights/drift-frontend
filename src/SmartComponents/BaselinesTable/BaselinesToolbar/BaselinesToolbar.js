import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { SimpleTableFilter } from '@redhat-cloud-services/frontend-components';

import CreateBaselineButton from '../../BaselinesPage/CreateBaselineButton/CreateBaselineButton';
import ExportCSVButton from '../../BaselinesPage/ExportCSVButton/ExportCSVButton';
import BaselinesKebab from '../../BaselinesPage/BaselinesKebab/BaselinesKebab';

class BaselinesToolbar extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch = debounce(function(search) {
        this.props.onSearch(search);
    }, 250)

    render() {
        const { createButton, exportButton, kebab } = this.props;

        return (
            <Toolbar className="drift-toolbar">
                <ToolbarGroup>
                    <ToolbarItem>
                        <SimpleTableFilter buttonTitle={ null }
                            onFilterChange={ this.handleSearch }
                            placeholder="Filter by name"
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
