import { applyReducerHash } from '@red-hat-insights/insights-frontend-components/Utilities/ReducerRegistry';
import { mergeArraysByKey } from '@red-hat-insights/insights-frontend-components/Utilities/helpers';

function selectedReducer(INVENTORY_ACTIONS, selectedSystemIds) {
    return applyReducerHash({
        [INVENTORY_ACTIONS.LOAD_ENTITIES_FULFILLED]: (state, action) => {
            for (let i = 0; i < action.payload.results.length; i += 1) {
                if (selectedSystemIds().includes(action.payload.results[i].id)) {
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
        }
    });
}

export default selectedReducer;
