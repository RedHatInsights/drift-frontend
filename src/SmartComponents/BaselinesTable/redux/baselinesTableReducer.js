import types from './types';
import baselinesReducerHelpers from './helpers';

const initialState = {
    baselineListLoading: false,
    baselineDataLoading: false,
    baselineDeleteLoading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    selectedBaselineIds: [],
    baselineUUID: '',
    baselineData: undefined,
    IdToDelete: ''
};

export function baselinesTableReducer(state = initialState, action) {
    let rows = [];
    let selectedBaselines = [];
    let newBaselineTableData;

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
        case `${types.CLEAR_SELECTED_BASELINES}`:
            return {
                ...state,
                selectedBaselineIds: []
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
        case `${types.ADD_BASELINE_UUID}`:
            return {
                ...state,
                baselineUUID: action.payload
            };
        case `${types.CLEAR_BASELINE_DATA}`:
            return {
                ...state,
                baselineUUID: '',
                baselineData: undefined
            };
        case `${types.CREATE_BASELINE}_PENDING`:
            return {
                ...state,
                baselineListLoading: true,
                baselineDataLoading: true
            };
        case `${types.CREATE_BASELINE}_FULFILLED`:
            return {
                ...state,
                baselineListLoading: false,
                baselineDataLoading: false,
                baselineUUID: action.payload.id,
                baselineData: action.payload
            };
        case `${types.PATCH_BASELINE}_PENDING`:
            return {
                ...state,
                baselineDataLoading: true
            };
        case `${types.PATCH_BASELINE}_FULFILLED`:
            return {
                ...state,
                baselineDataLoading: false,
                baselineData: action.payload
            };
        case `${types.SET_ID_DELETE}`:
            return {
                ...state,
                IdToDelete: action.payload
            };
        case `${types.DELETE_BASELINE}_PENDING`:
            return {
                ...state,
                baselineDeleteLoading: true
            };
        case `${types.DELETE_BASELINE}_FULFILLED`:
            newBaselineTableData = baselinesReducerHelpers.removeDeletedRow(state.fullBaselineListData, state.IdToDelete);
            return {
                ...state,
                baselineDeleteLoading: false,
                baselineTableData: newBaselineTableData,
                IdToDelete: ''
            };
        case `${types.DELETE_BASELINE}_REJECTED`:
            return {
                ...state,
                baselineDeleteLoading: false,
                IdToDelete: ''
            };

        default:
            return state;
    }
}
