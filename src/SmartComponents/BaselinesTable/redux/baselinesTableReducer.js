import types from './types';

const initialState = {
    loading: false,
    fullBaselineListData: [],
    baselineTableData: []
};

function buildBaselinesTable(data) {
    let rows = [];

    data.forEach(function(baseline) {
        rows.push([ baseline.display_name, baseline.updated ]);
    });

    return rows;
}

export function baselinesTableReducer(state = initialState, action) {
    let rows = [];

    switch (action.type) {
        case `${types.FETCH_BASELINE_LIST}_PENDING`:
            return {
                ...state,
                loading: true
            };
        case `${types.FETCH_BASELINE_LIST}_FULFILLED`:
            rows = buildBaselinesTable(action.payload.results);
            return {
                ...state,
                loading: false,
                fullBaselineListData: action.payload.results,
                baselineTableData: rows
            };
        case `${types.SELECT_BASELINE}`:
            return {
                ...state,
                baselineTableData: action.payload
            };

        default:
            return state;
    }
}

