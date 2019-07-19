import types from './types';
import editBaselineHelpers from './helpers';

let loadingRows = editBaselineHelpers.renderLoadingRows();

const initialState = {
    rows: loadingRows,
    columns: [ 'Fact', 'Value' ]
};

export function editBaselineReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.UPDATE_TABLE}`:
            return {
                ...state,
                rows: editBaselineHelpers.renderRows(action.payload),
                columns: editBaselineHelpers.renderColumns(action.payload)
            };

        default:
            return state;
    }
}
