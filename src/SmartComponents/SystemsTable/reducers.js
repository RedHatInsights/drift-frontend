import { applyReducerHash } from '@red-hat-insights/insights-frontend-components/Utilities/ReducerRegistry';
import { mergeArraysByKey } from '@red-hat-insights/insights-frontend-components/Utilities/helpers';

function selectedReducer(INVENTORY_ACTIONS, selectedSystemIds) {
    return applyReducerHash({
        [INVENTORY_ACTIONS.LOAD_ENTITIES_FULFILLED]: (state, action) => {
            for (let i = 0; i < action.payload.results.length; i += 1) {
                if (selectedSystemIds.includes(action.payload.results[i].id)) {
                    action.payload.results[i].selected = true;
                }
            }

            let rows = mergeArraysByKey([ action.payload.results, state.rows ]);
            return {
                ...state,
                rows
            };
        }
    });
}

export default selectedReducer;
