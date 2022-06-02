/*eslint-disable camelcase*/
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { LockIcon } from '@patternfly/react-icons';
import selectedReducer from '../../store/reducers';
import { compareActions } from '../modules';
import systemsTableActions from './actions';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import { historicProfilesActions } from '../HistoricalProfilesPopover/redux';
import { RegistryContext } from '../../Utilities/registry';
import useSystemsBulkSelect from './systemsHooks';

export const SystemsTable = ({
    baselineId,
    bulkSelectDisabled,
    createBaselineModal,
    deselectHistoricalProfiles,
    driftClearFilters,
    entities,
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
    systemNotificationIds,
    systemColumns
}) => {
    const tagsFilter = useSelector(({ globalFilterState }) => globalFilterState?.tagsFilter);
    const workloadsFilter = useSelector(({ globalFilterState }) => globalFilterState?.workloadsFilter);
    const sidsFilter = useSelector(({ globalFilterState }) => globalFilterState?.sidsFilter);
    const getEntities = useRef(() => undefined);
    const bulkSelect = useSystemsBulkSelect(
        'systems-bulk-select', entities, selectEntities, bulkSelectDisabled, isAddSystemNotifications
    );
    console.log(systemNotificationIds, 'systemNotificationIds');
    console.log(isAddSystemNotifications, 'isAddSystemNotifications');
    //console.log(entities, 'entitiesTable');

    return (
        permissions.inventoryRead ? (
            <div className='inventory-toolbar-no-padding'>
                <RegistryContext.Consumer>
                    { registryContextValue =>
                        <InventoryTable
                            columns={ systemColumns }
                            onLoad={ ({ mergeWithEntities, INVENTORY_ACTION_TYPES, api }) => {
                                getEntities.current = api?.getEntities;
                                driftClearFilters();
                                registryContextValue?.registry?.register(mergeWithEntities(
                                    selectedReducer(
                                        INVENTORY_ACTION_TYPES, baselineId, createBaselineModal, historicalProfiles,
                                        hasMultiSelect, deselectHistoricalProfiles, isAddSystemNotifications,
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
                                        ...workloadsFilter?.['Ansible Automation Platform']?.isSelected
                                    && { ansible: 'not_nil' },
                                        ...workloadsFilter?.['Microsoft SQL']?.isSelected
                                    && { mssql: 'not_nil' },
                                        ...sidsFilter?.length > 0 && { sap_sids: sidsFilter }
                                    }
                                }
                            }}
                            tableProps={{
                                canSelectAll: false,
                                selectVariant,
                                ouiaId: 'systems-table',
                                className: 'inventory-align',
                                isStickyHeader: true
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
                                    console.log('here');
                                    const data = await getEntities.current?.([], config, true);
                                    console.log(data, 'data');
                                    return { ...data };
                                } }
                            bulkSelect={ bulkSelect }
                        />
                    }
                </RegistryContext.Consumer>
            </div>
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
    historicalProfiles: PropTypes.array,
    hasMultiSelect: PropTypes.bool,
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
    deselectHistoricalProfiles: PropTypes.func,
    systemColumns: PropTypes.array,
    bulkSelectDisabled: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
    return {
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch(systemsTableActions.clearAllFilters()),
        selectEntities: (toSelect) => dispatch({ type: 'SELECT_ENTITY', payload: toSelect }),
        selectSingleHSP: (profile) => dispatch(systemsTableActions.selectSingleHSP(profile))
    };
}

SystemsTable.defaultProps = {
    selectedSystemIds: []
};

export default connect(null, mapDispatchToProps)(SystemsTable);
/*eslint-enable camelcase*/
