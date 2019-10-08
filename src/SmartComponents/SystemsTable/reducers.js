import { mergeArraysByKey } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';

import types from '../modules/types';

function selectedReducer(INVENTORY_ACTIONS, createBaselineModal) {
    return applyReducerHash({
        [INVENTORY_ACTIONS.LOAD_ENTITIES_FULFILLED]: (state, action) => {
            for (let i = 0; i < action.payload.results.length; i += 1) {
                if (state.selectedSystemIds.includes(action.payload.results[i].id)) {
                    action.payload.results[i].selected = true;
                }
            }

            let rows = mergeArraysByKey([ action.payload.results, state.rows ]);

            rows = rows.sort(function(a, b) {
                let comparison = 0;

                if (a.display_name < b.display_name) {
                    comparison = -1;
                } else if (a.display_name > b.display_name) {
                    comparison = 1;
                }

                return comparison;
            });

            rows = rows.sort(function(a, b) {
                let comparison = 0;

                if (a.selected && !b.selected) {
                    comparison = -1;
                } else if (!a.selected && b.selected) {
                    comparison = 1;
                }

                return comparison;
            });

            return {
                ...state,
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
