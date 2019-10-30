import types from './types';
import editBaselineHelpers from '../helpers';

const initialState = {
    baselineData: undefined,
    baselineDataLoading: false,
    editBaselineTableData: [],
    editNameModalOpened: false,
    error: {},
    expandedRows: [],
    factModalOpened: false,
    factName: '',
    factValue: '',
    factData: [],
    isCategory: false,
    isSubFact: false
};

export function editBaselineReducer(state = initialState, action) {
    let errorObject = {};
    let filteredBaselineData = [];
    let newEditBaselineTableData = [];
    let newExpandedRows = [];
    let response;

    switch (action.type) {
        case `${types.TOGGLE_EDIT_NAME_MODAL}`:
            return {
                ...state,
                editNameModalOpened: !state.editNameModalOpened,
                error: {}
            };
        case `${types.FETCH_BASELINE_DATA}_PENDING`:
            return {
                ...state,
                baselineDataLoading: true
            };
        case `${types.FETCH_BASELINE_DATA}_FULFILLED`:
            filteredBaselineData = editBaselineHelpers.filterBaselineData(action.payload.baseline_facts, []);
            return {
                ...state,
                baselineDataLoading: false,
                baselineData: action.payload,
                editBaselineTableData: filteredBaselineData
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
        case `${types.PATCH_BASELINE}_REJECTED`:
            response = action.payload.response;

            if (response.data === '') {
                errorObject = { detail: response.statusText, status: response.status };
            } else if (response.data.message) {
                errorObject = { detail: response.data.message, status: response.status };
            } else {
                errorObject = { detail: response.data.detail, status: response.status };
            }

            return {
                ...state,
                baselineDataLoading: false,
                error: errorObject
            };
        case `${types.EXPAND_PARENT_FACT}`:
            newExpandedRows = editBaselineHelpers.toggleExpandedRow(state.expandedRows, action.payload);
            newEditBaselineTableData = editBaselineHelpers.filterBaselineData(state.baselineData.baseline_facts, newExpandedRows);
            return {
                ...state,
                expandedRows: newExpandedRows,
                editBaselineTableData: newEditBaselineTableData
            };
        case `${types.TOGGLE_FACT_MODAL}`:
            return {
                ...state,
                error: {},
                factModalOpened: !state.factModalOpened
            };
        case `${types.SET_FACT_DATA}`:
            return {
                ...state,
                factName: action.payload.factName,
                factValue: action.payload.factValue,
                factData: action.payload.fact,
                isCategory: action.payload.isCategory,
                isSubFact: action.payload.isSubFact
            };

        default:
            return state;
    }
}
