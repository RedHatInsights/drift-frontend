import types from './types';

const initialState = {
    loading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    selectedBaselineIds: []
};

function buildBaselinesTable(data, selectedBaselineIds) {
    let rows = [];

    data.forEach(function(baseline) {
        let row = [];

        row.push(baseline.display_name);
        row.push(baseline.updated);

        if (selectedBaselineIds) {
            if (selectedBaselineIds.find(function(id) {
                return baseline.id === id;
            })) {
                row.selected = true;
            }
        }

        rows.push(row);
    });

    return rows;
}

function setBaselineArray(baselines, fullBaselineData) {
    let baselineArray = [];
    let baselineId = '';

    baselines.forEach(function(baseline) {
        if (baseline.selected) {
            baselineId = findBaselineId(baseline, fullBaselineData);
            baselineArray.push(baselineId);
        }
    });

    return baselineArray;
}

function findBaselineId(baseline, fullBaselineData) {
    let baselineId = '';

    fullBaselineData.forEach(function(baselineData) {
        if (baselineData.display_name === baseline[0]) {
            baselineId = baselineData.id;
        }
    });

    return baselineId;
}

export function baselinesTableReducer(state = initialState, action) {
    let rows = [];
    let selectedBaselines = [];

    switch (action.type) {
        case `${types.FETCH_BASELINE_LIST}_PENDING`:
            return {
                ...state,
                loading: true
            };
        case `${types.FETCH_BASELINE_LIST}_FULFILLED`:
            rows = buildBaselinesTable(action.payload.results, state.selectedBaselineIds);
            return {
                ...state,
                loading: false,
                fullBaselineListData: action.payload.results,
                baselineTableData: rows
            };
        case `${types.SELECT_BASELINE}`:
            selectedBaselines = setBaselineArray(action.payload, state.fullBaselineListData);
            return {
                ...state,
                baselineTableData: action.payload,
                selectedBaselineIds: selectedBaselines
            };
        case `${types.SET_SELECTED_BASELINE_IDS}`:
            return {
                ...state,
                selectedBaselineIds: action.payload
            };

        default:
            return state;
    }
}
