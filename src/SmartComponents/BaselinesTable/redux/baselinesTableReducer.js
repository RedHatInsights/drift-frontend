import types from './types';
import baselinesReducerHelpers from './helpers';
import union from 'lodash/union';

const initialState = {
    baselineListLoading: true,
    baselineDataLoading: false,
    baselineDeleteLoading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    selectedBaselineIds: [],
    baselineData: undefined,
    editBaselineTableData: [],
    IdToDelete: '',
    expandedRows: [],
    emptyState: false
};

export function baselinesTableReducer(state = initialState, action) {
    let rows = [];
    let selectedBaselines = [];
    let newBaselineTableData;
    let newFullBaselineList;
    let filteredBaselineData = [];
    let newExpandedRows = [];
    let newEditBaselineTableData = [];

    switch (action.type) {
        case `${types.FETCH_BASELINE_LIST}_PENDING`:
            return {
                ...state,
                baselineListLoading: true
            };
        case `${types.FETCH_BASELINE_LIST}_FULFILLED`:
            rows = baselinesReducerHelpers.buildBaselinesTable(action.payload.data, state.selectedBaselineIds);
            return {
                ...state,
                baselineListLoading: false,
                fullBaselineListData: action.payload.data,
                emptyState: action.payload.meta.total_available === 0,
                baselineTableData: rows
            };
        case `${types.SELECT_BASELINE}`:
            selectedBaselines = [ ...state.selectedBaselineIds ];

            if (action.payload.ids.length === 0) {
                selectedBaselines = [];
            } else if (action.payload.isSelected) {
                selectedBaselines = union(selectedBaselines.concat(action.payload.ids));
            } else if (!action.payload.isSelected) {
                selectedBaselines = selectedBaselines.filter(function(item) {
                    return !action.payload.ids.includes(item);
                });
            }

            newBaselineTableData = [ ...state.baselineTableData ];

            newBaselineTableData.map(row => {
                if (action.payload.ids.includes(row[0])) {
                    row.selected = action.payload.isSelected;
                }
            });

            return {
                ...state,
                baselineTableData: newBaselineTableData,
                selectedBaselineIds: selectedBaselines
            };
        case `${types.SET_SELECTED_BASELINES}`:
            rows = baselinesReducerHelpers.buildBaselinesTable(state.fullBaselineListData, action.payload);
            return {
                ...state,
                baselineTableData: rows,
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
            filteredBaselineData = baselinesReducerHelpers.filterBaselineData(action.payload.baseline_facts, []);
            return {
                ...state,
                baselineDataLoading: false,
                baselineData: action.payload,
                editBaselineTableData: filteredBaselineData
            };
        case `${types.ADD_BASELINE_UUID}`:
            return {
                ...state,
                baselineUUID: action.payload
            };
        case `${types.CLEAR_BASELINE_DATA}`:
            return {
                ...state,
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
            newBaselineTableData = baselinesReducerHelpers.buildNewTableData(state.fullBaselineListData, state.IdToDelete);
            newFullBaselineList = baselinesReducerHelpers.buildNewBaselineList(state.fullBaselineListData, state.IdToDelete);
            return {
                ...state,
                baselineDeleteLoading: false,
                baselineTableData: newBaselineTableData,
                fullBaselineListData: newFullBaselineList,
                IdToDelete: ''
            };
        case `${types.DELETE_BASELINE}_REJECTED`:
            return {
                ...state,
                baselineDeleteLoading: false,
                IdToDelete: ''
            };
        case `${types.EXPAND_PARENT_FACT}`:
            newExpandedRows = baselinesReducerHelpers.toggleExpandedRow(state.expandedRows, action.payload);
            newEditBaselineTableData = baselinesReducerHelpers.filterBaselineData(state.baselineData.baseline_facts, newExpandedRows);
            return {
                ...state,
                expandedRows: newExpandedRows,
                editBaselineTableData: newEditBaselineTableData
            };

        default:
            return state;
    }
}
