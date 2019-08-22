import types from './types';
import helpers from './helpers';

export function baselinesKebabReducer(state = {}, action) {
    switch (action.type) {
        case `${types.EXPORT_BASELINES_LIST_TO_CSV}`:
            helpers.downloadCSV(action.payload);
            return {
                ...state
            };
        default:
            return {
                ...state
            };
    }
}
