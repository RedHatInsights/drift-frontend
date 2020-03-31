import React from 'react';
import { mergeArraysByKey } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import HistoricalProfilesDropdown from '../HistoricalProfilesDropdown/HistoricalProfilesDropdown';

import types from '../modules/types';

function selectedReducer(INVENTORY_ACTIONS, createBaselineModal, historicalProfiles, hasHistoricalDropdown) {
    let newColumns;

    return applyReducerHash({
        [INVENTORY_ACTIONS.LOAD_ENTITIES_FULFILLED]: (state, action) => {
            newColumns = [ ...state.columns ];

            for (let i = 0; i < action.payload.results.length; i += 1) {
                if (state.selectedSystemIds.includes(action.payload.results[i].id)) {
                    action.payload.results[i].selected = true;
                }
            }

            let rows = mergeArraysByKey([ action.payload.results, state.rows ]);

            if (insights.chrome.isBeta() && historicalProfiles !== undefined) {
                /*eslint-disable camelcase*/
                if (!newColumns.find(({ key }) => key === 'historical_profiles') && hasHistoricalDropdown) {
                    newColumns.push({
                        key: 'historical_profiles',
                        title: 'Historical profiles',
                        props: {
                            isStatic: true,
                            width: 10
                        }
                    });
                }

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

                    row.historical_profiles = <React.Fragment>
                        <HistoricalProfilesDropdown
                            system={ systemInfo }
                            hasBadge={ true }
                            badgeCount={ badgeCount }
                        />
                    </React.Fragment>;
                });
                /*eslint-enable camelcase*/
            }

            return {
                ...state,
                columns: newColumns,
                rows
            };
        },
        [types.SELECT_ENTITY]: (state, action) => {
            let id = action.payload.id;
            let selected = action.payload.selected;
            let { selectedSystemIds } = state;
            let newRows = [];

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
                        for (let i = 0; i < state.rows.length; i += 1) {
                            selectedSystemIds = selectedSystemIds.filter(item => item !== state.rows[i].id);
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

            return {
                ...state,
                selectedSystemIds,
                rows: newRows.length > 0 ? newRows : state.rows
            };
        },
        [types.SET_SELECTED_SYSTEM_IDS]: (state, action) => {
            return {
                ...state,
                selectedSystemIds: action.payload.selectedSystemIds
            };
        }
    });
}

export default selectedReducer;
