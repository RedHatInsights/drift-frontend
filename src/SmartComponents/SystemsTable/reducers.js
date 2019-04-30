import { applyReducerHash } from '@red-hat-insights/insights-frontend-components/Utilities/ReducerRegistry';
import { mergeArraysByKey } from '@red-hat-insights/insights-frontend-components/Utilities/helpers';

import types from '../modules/types';

function selectedReducer(INVENTORY_ACTIONS) {
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

            if (id === 0) {
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
            } else if (selected && id !== null) {
                selectedSystemIds.push(id);
            } else {
                selectedSystemIds = selectedSystemIds.filter(item => item !== id);
            }

            return {
                ...state, selectedSystemIds
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
