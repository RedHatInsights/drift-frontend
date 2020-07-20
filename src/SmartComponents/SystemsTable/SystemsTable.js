import React, { Fragment, useState, useEffect } from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import PropTypes from 'prop-types';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { connect } from 'react-redux';
import * as pfReactTable from '@patternfly/react-table';

import selectedReducer from './reducers';
import { compareActions } from '../modules';

const SystemsTable = ({
    selectedSystemIds,
    setSelectedSystemIds,
    driftClearFilters,
    createBaselineModal,
    hasHistoricalDropdown,
    historicalProfiles
}) => {
    const [ InventoryCmp, setInventoryCmp ] = useState(null);
    const store = ReactRedux.useStore();
    const fetchInventory = async () => {
        const { inventoryConnector, mergeWithEntities, INVENTORY_ACTION_TYPES } = await insights.loadInventory({
            ReactRedux,
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReactTable
        });

        driftClearFilters();

        getRegistry().register(mergeWithEntities(
            selectedReducer(INVENTORY_ACTION_TYPES, createBaselineModal, historicalProfiles, hasHistoricalDropdown)
        ));

        setInventoryCmp(inventoryConnector(store).InventoryTable);
        setSelectedSystemIds(selectedSystemIds);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <Fragment>
            { InventoryCmp ?
                <InventoryCmp showTags />
                : <reactCore.Spinner size="lg" />
            }
        </Fragment>
    );
};

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
