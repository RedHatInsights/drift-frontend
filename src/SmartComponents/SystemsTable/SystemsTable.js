import React, { Fragment, useState, useEffect } from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import PropTypes from 'prop-types';
import * as reactIcons from '@patternfly/react-icons';
import * as reactCore from '@patternfly/react-core';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { connect } from 'react-redux';
import * as pfReactTable from '@patternfly/react-table';

import selectedReducer from '../../store/reducers';
import { addNewListener } from '../../store';
import { compareActions } from '../modules';
import { historicProfilesActions } from '../HistoricalProfilesDropdown/redux';
import systemsTableActions from './actions';

const SystemsTable = ({
    selectedSystemIds,
    setSelectedSystemIds,
    driftClearFilters,
    createBaselineModal,
    hasHistoricalDropdown,
    historicalProfiles,
    hasMultiSelect,
    selectHistoricProfiles,
    updateColumns
}) => {
    const [ InventoryCmp, setInventoryCmp ] = useState(null);
    const store = ReactRedux.useStore();

    const deselectHistoricalProfiles = () => {

        if (!hasMultiSelect) {
            updateColumns('display_name');
            selectHistoricProfiles([]);
        }
    };

    const fetchInventory = async () => {
        const { inventoryConnector, mergeWithEntities, INVENTORY_ACTION_TYPES } = await insights.loadInventory({
            ReactRedux,
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReactTable,
            pfReact: reactCore
        });

        driftClearFilters();

        getRegistry().register(mergeWithEntities(
            selectedReducer(
                INVENTORY_ACTION_TYPES, createBaselineModal, historicalProfiles,
                hasMultiSelect, hasHistoricalDropdown, deselectHistoricalProfiles
            )
        ));

        setInventoryCmp(inventoryConnector(store).InventoryTable);
        setSelectedSystemIds(selectedSystemIds);
    };

    useEffect(() => {
        window.entityListener = addNewListener({
            actionType: 'SELECT_ENTITY',
            callback: () => {
                !hasMultiSelect ? deselectHistoricalProfiles() : null;
            }
        });

        fetchInventory();
    }, []);

    return (
        <Fragment>
            { InventoryCmp ?
                <InventoryCmp showTags noDetail />
                : <reactCore.Spinner size="lg" />
            }
        </Fragment>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
        updateColumns: (key) => dispatch(systemsTableActions.updateColumns(key))
    };
}

SystemsTable.propTypes = {
    setSelectedSystemIds: PropTypes.func,
    selectedSystemIds: PropTypes.array,
    selectHistoricProfiles: PropTypes.func,
    createBaselineModal: PropTypes.bool,
    driftClearFilters: PropTypes.func,
    hasHistoricalDropdown: PropTypes.bool,
    historicalProfiles: PropTypes.array,
    hasMultiSelect: PropTypes.bool,
    updateColumns: PropTypes.func,
    selectedHSPIds: PropTypes.array
};

SystemsTable.defaultProps = {
    selectedSystemIds: []
};

export default connect(null, mapDispatchToProps)(SystemsTable);
