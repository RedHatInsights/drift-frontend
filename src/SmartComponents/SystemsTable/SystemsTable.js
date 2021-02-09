/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { connect } from 'react-redux';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/components/cjs/Inventory';
import { LockIcon } from '@patternfly/react-icons';

import selectedReducer from '../../store/reducers';
import { addNewListener } from '../../store';
import { compareActions } from '../modules';
import { historicProfilesActions } from '../HistoricalProfilesPopover/redux';
import systemsTableActions from './actions';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import helpers from '../helpers';

export const SystemsTable = ({
    selectedSystemIds,
    setSelectedSystemIds,
    driftClearFilters,
    createBaselineModal,
    hasHistoricalDropdown,
    historicalProfiles,
    hasMultiSelect,
    selectHistoricProfiles,
    updateColumns,
    hasInventoryReadPermissions,
    entities,
    selectEntities,
    selectVariant
}) => {
    const tagsFilter = useSelector(({ globalFilterState }) => globalFilterState?.tagsFilter);
    const workloadsFilter = useSelector(({ globalFilterState }) => globalFilterState?.workloadsFilter);
    const sidsFilter = useSelector(({ globalFilterState }) => globalFilterState?.sidsFilter);

    const deselectHistoricalProfiles = () => {
        if (!hasMultiSelect) {
            updateColumns('display_name');
            selectHistoricProfiles([]);
        }
    };

    const onSelect = (event) => {
        let toSelect = [];
        switch (event) {
            case 'none': {
                toSelect = { id: 0, selected: false, bulk: true };

                break;
            }

            case 'page': {
                toSelect = { id: 0, selected: true };

                break;
            }
        }

        selectEntities(toSelect);
    };

    useEffect(() => {
        window.entityListener = addNewListener({
            actionType: 'SELECT_ENTITY',
            callback: () => {
                !hasMultiSelect ? deselectHistoricalProfiles() : null;
            }
        });
    }, []);

    return (
        hasInventoryReadPermissions ? (
            <InventoryTable
                onLoad={ ({ mergeWithEntities, INVENTORY_ACTION_TYPES }) => {
                    driftClearFilters();
                    getRegistry().register(mergeWithEntities(
                        selectedReducer(
                            INVENTORY_ACTION_TYPES, createBaselineModal, historicalProfiles,
                            hasMultiSelect, hasHistoricalDropdown, deselectHistoricalProfiles
                        )
                    ));
                    setSelectedSystemIds(selectedSystemIds);
                } }
                showTags
                noDetail
                customFilters={{
                    tags: tagsFilter,
                    filter: {
                        system_profile: {
                            ...workloadsFilter?.SAP?.isSelected && { sap_system: true },
                            ...sidsFilter?.length > 0 && { sap_sids: sidsFilter }
                        }
                    }
                }}
                tableProps={{
                    canSelectAll: false,
                    selectVariant,
                    ouiaId: 'systems-table'
                }}
                total={ entities?.total }
                bulkSelect={ onSelect && {
                    isDisabled: !hasMultiSelect,
                    count: entities && entities.selectedSystemIds ? entities.selectedSystemIds.length : 0,
                    items: [{
                        title: `Select none (0)`,
                        onClick: () => {
                            onSelect('none');
                        }
                    }, {
                        title: `Select page (${ entities?.count || 0 })`,
                        onClick: () => {
                            onSelect('page');
                        }
                    }],
                    onSelect: (value) => {
                        value ? onSelect('page') : onSelect('none');
                    },
                    checked: entities && entities.selectedSystemIds
                        ? helpers.findCheckedValue(entities?.total, entities?.selectedSystemIds.length)
                        : null
                } }
            />
        )
            : <EmptyStateDisplay
                icon={ LockIcon }
                color='#6a6e73'
                title={ 'You do not have access to the inventory' }
                text={ [ 'Contact your organization administrator(s) for more information.' ] }
            />
    );
};

function mapDispatchToProps(dispatch) {
    return {
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch(systemsTableActions.clearAllFilters()),
        updateColumns: (key) => dispatch(systemsTableActions.updateColumns(key)),
        selectEntities: (toSelect) => dispatch({ type: 'SELECT_ENTITY', payload: toSelect })
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
    selectedHSPIds: PropTypes.array,
    hasInventoryReadPermissions: PropTypes.bool,
    entities: PropTypes.object,
    selectEntities: PropTypes.func,
    selectVariant: PropTypes.string
};

SystemsTable.defaultProps = {
    selectedSystemIds: []
};

export default connect(null, mapDispatchToProps)(SystemsTable);
