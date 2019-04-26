import React, { Component } from 'react';
import * as reactRouterDom from 'react-router-dom';
import PropTypes from 'prop-types';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { PaginationRow } from 'patternfly-react';
import { registry as registryDecorator } from '@red-hat-insights/insights-frontend-components';

import selectedReducer from './reducers';

@registryDecorator()
class SystemsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>
        };

        this.fetchInventory();
        this.selectedSystemIds = this.selectedSystemIds.bind(this);
    }

    selectedSystemIds() {
        return this.props.selectedSystemIds;
    }

    async fetchInventory() {
        const { inventoryConnector, mergeWithEntities, INVENTORY_ACTION_TYPES } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReact: { PaginationRow }
        });

        this.getRegistry().register({
            ...mergeWithEntities(
                selectedReducer(INVENTORY_ACTION_TYPES, this.selectedSystemIds)
            )
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });
    }

    render() {
        const { InventoryCmp } = this.state;
        return (
            <InventoryCmp />
        );
    }
}

SystemsTable.propTypes = {
    selectedSystemIds: PropTypes.array
};

SystemsTable.defaultProps = {
    selectedSystemIds: []
};

export default SystemsTable;
