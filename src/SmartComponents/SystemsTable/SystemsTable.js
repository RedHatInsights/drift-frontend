/*eslint-disable camelcase*/
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { LockIcon } from '@patternfly/react-icons';
import selectedReducer from '../../store/reducers';
import { compareActions } from '../modules';
import systemsTableActions from './actions';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import { historicProfilesActions } from '../HistoricalProfilesPopover/redux';
import helpers from '../helpers';

export const SystemsTable = ({
    baselineId,
    createBaselineModal,
    deselectHistoricalProfiles,
    driftClearFilters,
    entities,
    hasHistoricalDropdown,
    permissions,
    hasMultiSelect,
    historicalProfiles,
    isAddSystemNotifications,
    selectedSystemIds,
    selectEntities,
    selectHistoricProfiles,
    selectSystemsToAdd,
    selectVariant,
    setSelectedSystemIds,
    systemNotificationIds
}) => {
    const tagsFilter = useSelector(({ globalFilterState }) => globalFilterState?.tagsFilter);
    const workloadsFilter = useSelector(({ globalFilterState }) => globalFilterState?.workloadsFilter);
    const sidsFilter = useSelector(({ globalFilterState }) => globalFilterState?.sidsFilter);
    const getEntities = useRef(() => undefined);

    const onSelect = (event) => {
        let toSelect = [];
        switch (event) {
            case 'none': {
                toSelect = { id: 0, selected: false, bulk: true };
                break;
            }

            case 'deselect-page': {
                toSelect = { id: 0, selected: false };
                break;
            }

            case 'page': {
                toSelect = { id: 0, selected: true };
                break;
            }
        }

        selectEntities(toSelect);
    };

    return (
        permissions.inventoryRead ? (
            <InventoryTable
                onLoad={ ({ mergeWithEntities, INVENTORY_ACTION_TYPES, api }) => {
                    getEntities.current = api?.getEntities;
                    driftClearFilters();
                    getRegistry().register(mergeWithEntities(
                        selectedReducer(
                            INVENTORY_ACTION_TYPES, baselineId, createBaselineModal, historicalProfiles,
                            hasMultiSelect, hasHistoricalDropdown, deselectHistoricalProfiles, isAddSystemNotifications,
                            selectHistoricProfiles, systemNotificationIds, selectSystemsToAdd
                        )
                    ));
                    createBaselineModal ? setSelectedSystemIds([]) : setSelectedSystemIds(selectedSystemIds);
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
                getEntities={ systemNotificationIds && !isAddSystemNotifications
                    ? async (_items, config) => {
                        const currIds = (systemNotificationIds || [])
                        .slice((config.page - 1) * config.per_page, config.page * config.per_page);
                        const data = await getEntities.current?.(
                            currIds,
                            {
                                hasItems: true
                            },
                            true
                        );

                        return {
                            ...data,
                            results: data.results.map((system) => ({
                                ...system,
                                ...currIds.find(({ uuid }) => uuid === system.id) || {}
                            })),
                            total: (systemNotificationIds || []).length,
                            page: config.page,
                            per_page: config.per_page
                        };
                    }
                    : async (_items, config) => {
                        const data = await getEntities.current?.([], config, true);
                        return { ...data };
                    } }
                bulkSelect={ onSelect && !isAddSystemNotifications && {
                    isDisabled: !hasMultiSelect,
                    count: entities?.selectedSystemIds?.length,
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
                    }, {
                        title: `Deselect page (${ entities?.count || 0 })`,
                        onClick: () => {
                            onSelect('deselect-page');
                        }
                    }],
                    onSelect: () => {
                        if (entities?.rows.length === entities?.selectedSystems?.length) {
                            onSelect('deselect-page');
                        } else {
                            onSelect('page');
                        }
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

SystemsTable.propTypes = {
    setSelectedSystemIds: PropTypes.func,
    selectedSystemIds: PropTypes.array,
    createBaselineModal: PropTypes.bool,
    driftClearFilters: PropTypes.func,
    hasHistoricalDropdown: PropTypes.bool,
    historicalProfiles: PropTypes.array,
    hasMultiSelect: PropTypes.bool,
    updateColumns: PropTypes.func,
    permissions: PropTypes.object,
    entities: PropTypes.object,
    selectEntities: PropTypes.func,
    selectVariant: PropTypes.string,
    systemNotificationIds: PropTypes.array,
    isAddSystemNotifications: PropTypes.bool,
    baselineId: PropTypes.string,
    selectHistoricProfiles: PropTypes.func,
    selectSystemsToAdd: PropTypes.func,
    selectSingleHSP: PropTypes.func,
    deselectHistoricalProfiles: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch(systemsTableActions.clearAllFilters()),
        updateColumns: (key) => dispatch(systemsTableActions.updateColumns(key)),
        selectEntities: (toSelect) => dispatch({ type: 'SELECT_ENTITY', payload: toSelect }),
        selectSingleHSP: (profile) => dispatch(systemsTableActions.selectSingleHSP(profile))
    };
}

SystemsTable.defaultProps = {
    selectedSystemIds: []
};

export default connect(null, mapDispatchToProps)(SystemsTable);
/*eslint-enable camelcase*/
