import React, { Component } from 'react';
import * as reactRouterDom from 'react-router-dom';
import PropTypes from 'prop-types';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { connect } from 'react-redux';
import * as pfReactTable from '@patternfly/react-table';

import selectedReducer from './reducers';
import { compareActions } from '../modules';

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
            pfReactTable
        });
        const { createBaselineModal, hasHistoricalDropdown, historicalProfiles } = this.props;

        this.props.driftClearFilters();

        this.getRegistry().register({
            ...mergeWithEntities(
                selectedReducer(INVENTORY_ACTION_TYPES, createBaselineModal, historicalProfiles, hasHistoricalDropdown)
            )
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        });

        this.props.setSelectedSystemIds(this.selectedSystemIds());
    }

    render() {
        const { InventoryCmp } = this.state;
        return (
            <InventoryCmp showTags="true"/>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch({ type: 'CLEAR_FILTERS' })
    };
}

SystemsTable.propTypes = {
    setSelectedSystemIds: PropTypes.func,
    selectedSystemIds: PropTypes.array,
    createBaselineModal: PropTypes.bool,
    driftClearFilters: PropTypes.func,
    hasHistoricalDropdown: PropTypes.bool,
    historicalProfiles: PropTypes.array
};

SystemsTable.defaultProps = {
    selectedSystemIds: []
};

export default connect(null, mapDispatchToProps)(SystemsTable);
