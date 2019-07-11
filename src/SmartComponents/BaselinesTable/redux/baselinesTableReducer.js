import types from './types';
import baselinesReducerHelpers from './helpers';

const initialState = {
    loading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    selectedBaselineIds: []
};

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
            rows = baselinesReducerHelpers.buildBaselinesTable(action.payload.results, state.selectedBaselineIds);
            return {
                ...state,
                loading: false,
                fullBaselineListData: action.payload.results,
                baselineTableData: rows
            };
        case `${types.SELECT_BASELINE}`:
            selectedBaselines = baselinesReducerHelpers.setBaselineArray(action.payload, state.fullBaselineListData);
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
