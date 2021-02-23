/*eslint-disable camelcase*/
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { connect } from 'react-redux';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/components/cjs/Inventory';
import { LockIcon } from '@patternfly/react-icons';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import MiddlewareListener from '@redhat-cloud-services/frontend-components-utilities/files/MiddlewareListener';

import selectedReducer from '../../store/reducers';
import { compareActions } from '../modules';
import systemsTableActions from './actions';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import helpers from '../helpers';
import isEqual from 'lodash/isEqual';

function mapDispatchToProps(dispatch) {
    return {
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch(systemsTableActions.clearAllFilters()),
        updateColumns: (key) => dispatch(systemsTableActions.updateColumns(key)),
        selectEntities: (toSelect) => dispatch({ type: 'SELECT_ENTITY', payload: toSelect })
    };
}

export const SystemsTable = connect(null, mapDispatchToProps)(({
    baselineId,
    setSelectedSystemIds,
    driftClearFilters,
    createBaselineModal,
    hasHistoricalDropdown,
    historicalProfiles,
    hasMultiSelect,
    selectHistoricProfiles,
    updateColumns,
    hasInventoryReadPermissions,
    selectEntities,
    selectVariant,
    systemNotificationIds,
    toolbarButton,
    isAddSystemNotifications,
    registry,
    onSystemSelect,
    selectSystemsToAdd,
    deleteNotifications,
    addNewListener
}) => {
    const tagsFilter = useSelector(({ globalFilterState }) => globalFilterState?.tagsFilter);
    const workloadsFilter = useSelector(({ globalFilterState }) => globalFilterState?.workloadsFilter);
    const sidsFilter = useSelector(({ globalFilterState }) => globalFilterState?.sidsFilter);
    const entities = useSelector(({ entities }) => entities);
    const selected = useSelector(({ entities }) => entities?.selectedSystemIds || []);
    const getEntities = useRef(() => undefined);
    const selectedRef = useRef([]);

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
            on: 'SELECT_ENTITY',
            callback: () => {
                !hasMultiSelect ? deselectHistoricalProfiles() : null;
            }
        });
    });

    useEffect(() => {
        if (!isEqual(selectedRef.current, selected)) {
            selectedRef.current = [ ...selected ];
            onSystemSelect(selected);
        }
    });

    return (
        hasInventoryReadPermissions ? (
            <InventoryTable
                onLoad={ ({ mergeWithEntities, INVENTORY_ACTION_TYPES, api }) => {
                    getEntities.current = api?.getEntities;
                    driftClearFilters();
                    registry.register(mergeWithEntities(
                        selectedReducer(
                            INVENTORY_ACTION_TYPES, baselineId, createBaselineModal, historicalProfiles,
                            hasMultiSelect, hasHistoricalDropdown, deselectHistoricalProfiles, isAddSystemNotifications,
                            selectHistoricProfiles, systemNotificationIds, selectSystemsToAdd, deleteNotifications
                        )
                    ));
                    setSelectedSystemIds(selected);
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
                getEntities={ async (_items, config) => {
                    const currIds = (systemNotificationIds || [])
                    .slice((config.page - 1) * config.per_page, config.page * config.per_page);
                    const data = await getEntities.current?.(
                        currIds,
                        {
                            ...config,
                            hasItems: true
                        },
                        false
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
                } }
                bulkSelect={ onSelect && {
                    isDisabled: !hasMultiSelect,
                    count: entities?.selectedSystemIds ? entities.selectedSystemIds.length : 0,
                    items: [{
                        title: `Select none (0)`,
                        onClick: () => {
                            onSelect('none');
                        }
                    }, {
                        title: `Select page (${ registry.entities?.count || 0 })`,
                        onClick: () => {
                            onSelect('page');
                        }
                    }],
                    onSelect: (value) => {
                        value ? onSelect('page') : onSelect('none');
                    },
                    checked: entities?.selectedSystemIds
                        ? helpers.findCheckedValue(entities?.total, entities?.selectedSystemIds.length)
                        : null
                } }
                actionsConfig={{
                    actions: [
                        toolbarButton,
                        <div key="delete-baseline-notification" onClick={ () => deleteNotifications(entities?.selectedSystemIds) }>
                            { entities?.selectedSystemIds?.length > 1 ? 'Delete notifications' : 'Delete notification' }
                        </div>
                    ]
                }}
            />
        )
            : <EmptyStateDisplay
                icon={ LockIcon }
                color='#6a6e73'
                title={ 'You do not have access to the inventory' }
                text={ [ 'Contact your organization administrator(s) for more information.' ] }
            />
    );
});

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
    selectVariant: PropTypes.string,
    systemNotificationIds: PropTypes.array,
    baselineId: PropTypes.string,
    toolbarDropdown: PropTypes.array,
    isAddSystemNotifications: PropTypes.bool,
    registry: PropTypes.shape({
        register: PropTypes.func
    }),
    onSystemSelect: PropTypes.func
};

SystemsTable.defaultProps = {
    selectedSystemIds: []
};

const SystemsTableWithContext = (props) => {
    const [ registry, setRegistry ] = useState();
    const listener = useRef();

    useEffect(() => {
        listener.current = new MiddlewareListener();
        setRegistry(() => new ReducerRegistry({}, [ listener.current.getMiddleware(), promiseMiddleware() ]));
    }, []);
    return registry?.store ? <Provider store={ registry.store }>
        <SystemsTable { ...props } registry={ registry } addNewListener={ (...args) => listener.current.addNew(...args) } />
    </Provider> : null;
};

export default SystemsTableWithContext;
/*eslint-enable camelcase*/
