/*eslint-disable camelcase*/
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { connect } from 'react-redux';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { LockIcon } from '@patternfly/react-icons';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import MiddlewareListener from '@redhat-cloud-services/frontend-components-utilities/MiddlewareListener';

import selectedReducer from '../../store/reducers';
import { compareActions } from '../modules';
import systemsTableActions from './actions';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import helpers from '../helpers';
import isEqual from 'lodash/isEqual';
import { BASELINE_API_ROOT } from '../../constants';

function mapDispatchToProps(dispatch) {
    return {
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch(systemsTableActions.clearAllFilters()),
        selectEntities: (toSelect) => dispatch({ type: 'SELECT_ENTITY', payload: toSelect })    };
}

export const SystemsTable = connect(null, mapDispatchToProps)(({
    baselineId,
    setSelectedSystemIds,
    driftClearFilters,
    createBaselineModal,
    historicalProfiles,
    hasMultiSelect,
    selectHistoricProfiles,
    permissions,
    selectEntities,
    selectVariant,
    systemNotificationIds,
    toolbarButton,
    isAddSystemNotifications,
    registry,
    onSystemSelect,
    selectSystemsToAdd,
    deleteNotifications,
    systemColumns
}) => {
    const tagsFilter = useSelector(({ globalFilterState }) => globalFilterState?.tagsFilter);
    const workloadsFilter = useSelector(({ globalFilterState }) => globalFilterState?.workloadsFilter);
    const sidsFilter = useSelector(({ globalFilterState }) => globalFilterState?.sidsFilter);
    const entities = useSelector(({ entities }) => entities);
    const selected = useSelector(({ entities }) => entities?.selectedSystemIds || []);
    const getEntities = useRef(() => undefined);
    const selectedRef = useRef([]);

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

    const buildTableProps = () => {
        if (permissions.notificationsWrite) {
            return {
                canSelectAll: false,
                selectVariant,
                ouiaId: 'systems-table',
                isStickyHeader: true
            };
        } else {
            return {
                canSelectAll: false,
                selectVariant,
                ouiaId: 'systems-table',
                onSelect: false,
                isStickyHeader: true
            };
        }
    };

    const buildDeleteNotificationsKebab = () => {
        return {
            label: entities?.selectedSystemIds?.length > 1 ? 'Delete associated systems' : 'Delete associated system',
            onClick: () => deleteNotifications(entities?.selectedSystemIds),
            props: {
                className: 'pointer',
                key: 'delete-baseline-notification',
                isDisabled: !entities?.selectedSystemIds?.length
            }
        };
    };

    const buildActionsConfig = () => {
        if (permissions.notificationsWrite) {
            return [
                toolbarButton,
                buildDeleteNotificationsKebab()
            ];
        } else {
            return [];
        }
    };

    useEffect(() => {
        if (!isEqual(selectedRef.current, selected)) {
            selectedRef.current = [ ...selected ];
            onSystemSelect(selected);
        }
    });

    const fetchSystems = async (baselineId, groupsArray, currIds) => {
        let path = `/baselines/${baselineId}/systems?`;
        let newPath;
        if (groupsArray?.length > 0) {
            newPath = path;
            let groupsString = 'group_names[]=' + groupsArray.join('&group_names[]=');
            newPath =  path.concat(groupsString);
            let request = axios.get(BASELINE_API_ROOT.concat(newPath)).then(res =>  res?.data?.system_ids);
            return request;
        } else {
            return currIds;
        }

    };

    return (
        permissions.inventoryRead ? (
            <InventoryTable
                columns={ systemColumns }
                onLoad={ ({ mergeWithEntities, INVENTORY_ACTION_TYPES, api }) => {
                    getEntities.current = api?.getEntities;
                    driftClearFilters();
                    registry.register(mergeWithEntities(
                        selectedReducer(
                            INVENTORY_ACTION_TYPES, baselineId, createBaselineModal, historicalProfiles,
                            hasMultiSelect, undefined, isAddSystemNotifications, selectHistoricProfiles,
                            systemNotificationIds, selectSystemsToAdd, deleteNotifications, permissions
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
                            ...workloadsFilter?.['Ansible Automation Platform']?.isSelected
                                && { ansible: { controller_version: true }},
                            ...workloadsFilter?.['Microsoft SQL']?.isSelected
                                && { mssql: { version: 'not_nil' }},
                            ...sidsFilter?.length > 0 && { sap_sids: sidsFilter }
                        }
                    }
                }}
                tableProps={ buildTableProps() }
                getEntities={ async (_items, config) => {
                    const currIds = (systemNotificationIds || [])
                    .slice((config.page - 1) * config.per_page, config.page * config.per_page);
                    const updatedData = await fetchSystems(baselineId, config.filters.hostGroupFilter, currIds);
                    const data = await getEntities.current?.(
                        currIds,
                        {
                            hasItems: true
                        },
                        true
                    );

                    return {
                        ...data,
                        results: updatedData?.map((system) => ({
                            ...data.results.find(({ id }) => id === system) || {}
                        })),
                        total: (updatedData || []).length,
                        page: config.page,
                        per_page: config.per_page
                    };
                } }
                bulkSelect={ onSelect && {
                    isDisabled: !hasMultiSelect || !permissions.notificationsWrite,
                    count: entities?.selectedSystemIds ? entities.selectedSystemIds.length : 0,
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
                    checked: entities?.selectedSystemIds
                        ? helpers.findCheckedValue(entities?.total, entities?.selectedSystemIds.length)
                        : null
                } }
                actionsConfig={{
                    actions: buildActionsConfig()
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
    historicalProfiles: PropTypes.array,
    hasMultiSelect: PropTypes.bool,
    selectedHSPIds: PropTypes.array,
    permissions: PropTypes.object,
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
    onSystemSelect: PropTypes.func,
    systemColumns: PropTypes.array
};

SystemsTable.defaultProps = {
    selectedSystemIds: []
};

const SystemsTableWithContext = (props) => {
    const [ registry, setRegistry ] = useState();
    const listener = useRef();

    useEffect(() => {
        listener.current = new MiddlewareListener();
        setRegistry(() => new ReducerRegistry({}, [ listener.current.getMiddleware(), promiseMiddleware ]));
    }, []);
    return registry?.store ? <Provider store={ registry.store }>
        <SystemsTable { ...props } registry={ registry } addNewListener={ (...args) => listener.current.addNew(...args) } />
    </Provider> : null;
};

export default SystemsTableWithContext;
/*eslint-enable camelcase*/
