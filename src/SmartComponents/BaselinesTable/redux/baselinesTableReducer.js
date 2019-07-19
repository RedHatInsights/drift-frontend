import types from './types';
import baselinesReducerHelpers from './helpers';

const initialState = {
    baselineListLoading: false,
    baselineDataLoading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    selectedBaselineIds: [],
    baselineData: undefined
};

export function baselinesTableReducer(state = initialState, action) {
    let rows = [];
    let selectedBaselines = [];

    switch (action.type) {
        case `${types.FETCH_BASELINE_LIST}_PENDING`:
            return {
                ...state,
                baselineListLoading: true
            };
        case `${types.FETCH_BASELINE_LIST}_FULFILLED`:
            rows = baselinesReducerHelpers.buildBaselinesTable(action.payload, state.selectedBaselineIds);
            return {
                ...state,
                baselineListLoading: false,
                fullBaselineListData: action.payload,
                baselineTableData: rows
            };
        case `${types.SELECT_BASELINE}`:
            selectedBaselines = baselinesReducerHelpers.setBaselineArray(action.payload, state.fullBaselineListData);
            return {
                ...state,
                baselineTableData: action.payload,
                selectedBaselineIds: selectedBaselines
            };
        case `${types.SET_SELECTED_BASELINES}`:
            return {
                ...state,
                selectedBaselineIds: action.payload
            };
        case `${types.FETCH_BASELINE_DATA}_PENDING`:
            return {
                ...state,
                baselineDataLoading: true
            };
        case `${types.FETCH_BASELINE_DATA}_FULFILLED`:
            return {
                ...state,
                baselineDataLoading: false,
                baselineData: action.payload
            };
        case `${types.CLEAR_BASELINE_DATA}`:
            return {
                ...state,
                baselineData: undefined
            };

        default:
            return state;
    }
}
