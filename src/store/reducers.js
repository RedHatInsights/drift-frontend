/*eslint-disable camelcase*/
import React from 'react';
import { mergeArraysByKey } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import HistoricalProfilesPopover from '../SmartComponents/HistoricalProfilesPopover/HistoricalProfilesPopover';
import SystemKebab from '../SmartComponents/BaselinesPage/EditBaselinePage/SystemNotification/SystemKebab/SystemKebab';

import types from '../SmartComponents/modules/types';
import helpers from '../SmartComponents/helpers';

function selectedReducer(
    INVENTORY_ACTIONS, baselineId, createBaselineModal, historicalProfiles, hasMultiSelect,
    deselectHistoricalProfiles, isAddSystemNotifications, selectHistoricProfiles, systemNotificationIds, selectSystemsToAdd,
    deleteNotifications, permissions
) {
    let newColumns;
    let systemIds;

    return applyReducerHash({
        [INVENTORY_ACTIONS.LOAD_ENTITIES_FULFILLED]: (state, action) => {

            for (let i = 0; i < action.payload.results.length; i += 1) {
                if (state.selectedSystemIds.includes(action.payload.results[i].id)) {
                    action.payload.results[i].selected = true;
                }
            }

            let rows = mergeArraysByKey([ action.payload.results, state.rows ]);

            if (historicalProfiles !== undefined) {
                rows.forEach(function(row) {
                    let badgeCount = 0;
                    let systemInfo = {
                        id: row.id,
                        last_updated: row.updated
                    };

                    historicalProfiles.forEach(function(profile) {
                        if (profile.system_id === row.id) {
                            badgeCount += 1;
                        }
                    });

                    row.historical_profiles = <div>
                        <div className='hsp-icon-align'>
                            <HistoricalProfilesPopover
                                system={ systemInfo }
                                hasBadge={ true }
                                badgeCount={ badgeCount }
                                hasMultiSelect={ hasMultiSelect }
                                selectHistoricProfiles={ selectHistoricProfiles }
                                systemName={ row.display_name }
                            />
                        </div>
                    </div>;
                });
            }

            if (isAddSystemNotifications) {
                rows.forEach(function(row) {
                    if (systemNotificationIds.includes(row.id)) {
                        row.selected = true;
                        row.disableSelection = true;
                    }
                });
            }

            if (baselineId && !isAddSystemNotifications && permissions.notificationsWrite) {
                rows.forEach(function(row) {
                    systemIds = [ row.id ];

                    row.system_notification = <React.Fragment>
                        <SystemKebab
                            systemIds={ systemIds }
                            deleteNotifications={ deleteNotifications }
                        />
                    </React.Fragment>;
                });
            }
            /*eslint-enable camelcase*/

            return {
                ...state,
                rows: state.selectedHSP && !hasMultiSelect
                    ? helpers.buildSystemsTableWithSelectedHSP(rows, state.selectedHSP, deselectHistoricalProfiles)
                    : rows,
                selectedSystems: helpers.findSelectedOnPage(rows, state.selectedSystemIds)
            };
        },
        [types.DRIFT_CLEAR_ALL_FILTERS]: (state) => ({
            ...state,
            activeFilters: undefined
        }),
        [types.UPDATE_COLUMNS]: (state, action) => {
            let nameColumn = {
                key: action.payload,
                title: 'Name',
                props: { width: 20 }
            };
            newColumns = [ ...state.columns || [] ];
            newColumns.shift();
            newColumns.unshift(nameColumn);

            return {
                ...state,
                columns: newColumns
            };
        },
        [types.SELECT_ENTITY]: (state, action) => {
            let id = action.payload.id;
            let selected = action.payload.selected;
            let { selectedSystemIds } = state;
            let newRows = [];
            let selectedSystems = [];

            if (id === 0) {
                if (createBaselineModal) {
                    newRows = state.rows.map(function (oneRow) {
                        oneRow.selected = false;
                        return oneRow;
                    });

                    selectedSystemIds = [];
                } else {
                    if (selected) {
                        let ids = state.rows.map(function (item) {
                            return item.id;
                        });
                        selectedSystemIds = [ ...new Set(selectedSystemIds.concat(ids)) ];
                    } else {
                        if (action.payload.bulk) {
                            selectedSystemIds = [];
                        } else {
                            for (let i = 0; i < state.rows.length; i += 1) {
                                selectedSystemIds = selectedSystemIds.filter(item => item !== state.rows[i].id);
                            }
                        }
                    }
                }
            } else if (selected && id !== null) {
                if (createBaselineModal) {
                    newRows = state.rows.map(function (oneRow) {
                        if (oneRow.id === id) {
                            oneRow.selected = true;
                        } else {
                            oneRow.selected = false;
                        }

                        return oneRow;
                    });

                    selectedSystemIds.pop();
                }

                selectedSystemIds.push(id);
            } else {
                selectedSystemIds = selectedSystemIds.filter(item => item !== id);
            }

            if (isAddSystemNotifications) {
                selectSystemsToAdd(selectedSystemIds);
            }

            if (newRows.length === 0) {
                selectedSystems = helpers.findSelectedOnPage(state.rows, selectedSystemIds);
            }

            return {
                ...state,
                selectedSystemIds,
                selectedSystems,
                rows: newRows.length > 0 ? newRows : state.rows
            };
        },
        [types.SET_SELECTED_SYSTEM_IDS]: (state, action) => {
            return {
                ...state,
                rows: [],
                loaded: false,
                selectedSystemIds: action.payload.selectedSystemIds
            };
        },
        [types.SELECT_SINGLE_HSP]: (state, action) => {
            return {
                ...state,
                rows: action.payload
                    ? helpers.buildSystemsTableWithSelectedHSP([ ...state.rows ], action.payload, deselectHistoricalProfiles)
                    : state.rows.map((row) => ({
                        ...row,
                        // eslint-disable-next-line camelcase
                        display_selected_hsp: undefined
                    })),
                selectedSystemIds: action.payload
                    ? []
                    : state.selectedSystemIds,
                selectedHSP: action.payload
            };
        },
        [types.DISABLE_SYSTEM_TABLE]: (state, action) => {
            state.rows.forEach(function(row) {
                row.disableSelection = action.payload;
            });

            return {
                ...state
            };
        }
    });
}

export default selectedReducer;
/*eslint-enable camelcase*/
