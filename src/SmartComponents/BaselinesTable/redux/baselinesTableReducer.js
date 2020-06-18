import baselinesReducerHelpers from './helpers';
import helpers from '../../helpers';
import union from 'lodash/union';

const initialState = {
    loading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    selectedBaselineIds: [],
    IdToDelete: '',
    emptyState: false,
    baselineError: {},
    page: 1,
    perPage: 50,
    totalBaselines: 0
};

const baselinesTableReducer = (tableId = '') => {
    const tableReducer = (state = initialState, action) => {
        let rows = [];
        let selectedBaselines = [];
        let newBaselineTableData = [];
        let newFullBaselineList;
        let response;
        let errorObject;
        let paginatedRows = [];

        switch (action.type) {
            case `FETCH_BASELINE_LIST_${tableId}_PENDING`:
                return {
                    ...state,
                    loading: true
                };
            case `FETCH_BASELINE_LIST_${tableId}_FULFILLED`:
                rows = baselinesReducerHelpers.buildBaselinesTable(action.payload.data, state.selectedBaselineIds, tableId);
                paginatedRows = helpers.paginateData(rows, 1, state.perPage);
                return {
                    ...state,
                    loading: false,
                    fullBaselineListData: action.payload.data,
                    emptyState: action.payload.meta.total_available === 0,
                    baselineTableData: paginatedRows,
                    totalBaselines: rows.length
                };
            case `FETCH_BASELINE_LIST_${tableId}_REJECTED`:
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
                    baselineError: errorObject
                };
            case `REVERT_BASELINE_FETCH_${tableId}`:
                return {
                    ...state,
                    baselineError: {},
                    loading: false
                };
            case `SELECT_BASELINE_${tableId}`:
                selectedBaselines = [ ...state.selectedBaselineIds ];

                if (action.payload.ids.length === 0) {
                    selectedBaselines = [];
                } else if (action.payload.isSelected) {
                    if (tableId === 'CHECKBOX') {
                        selectedBaselines = union(selectedBaselines.concat(action.payload.ids));
                    } else if (tableId === 'RADIO') {
                        selectedBaselines.pop();
                        selectedBaselines.push(action.payload.ids[0]);
                    }
                } else if (!action.payload.isSelected) {
                    selectedBaselines = selectedBaselines.filter(function(item) {
                        return !action.payload.ids.includes(item);
                    });
                }

                state.baselineTableData.map(row => {
                    if (selectedBaselines.includes(row[0])) {
                        row.selected = true;
                    } else {
                        row.selected = false;
                    }

                    newBaselineTableData.push(row);
                });

                return {
                    ...state,
                    baselineTableData: newBaselineTableData,
                    selectedBaselineIds: selectedBaselines
                };
            case `SET_SELECTED_BASELINES_${tableId}`:
                rows = baselinesReducerHelpers.buildBaselinesTable(state.fullBaselineListData, action.payload);
                paginatedRows = helpers.paginateData(rows, state.page, state.perPage);
                return {
                    ...state,
                    baselineTableData: paginatedRows,
                    selectedBaselineIds: action.payload,
                    totalBaselines: rows.length
                };
            case `CLEAR_SELECTED_BASELINES_${tableId}`:
                return {
                    ...state,
                    selectedBaselineIds: []
                };
            case `CLEAR_BASELINE_DATA_${tableId}`:
                return {
                    ...state,
                    baselineData: undefined
                };
            case `DELETE_BASELINE_${tableId}_PENDING`:
                return {
                    ...state,
                    loading: true
                };
            case `DELETE_BASELINE_${tableId}_FULFILLED`:
                newBaselineTableData = baselinesReducerHelpers.buildNewTableData(state.fullBaselineListData, state.IdToDelete);
                paginatedRows = helpers.paginateData(newBaselineTableData, state.page, state.perPage);
                newFullBaselineList = baselinesReducerHelpers.buildNewBaselineList(state.fullBaselineListData, state.IdToDelete);
                return {
                    ...state,
                    loading: false,
                    baselineTableData: paginatedRows,
                    fullBaselineListData: newFullBaselineList,
                    emptyState: newBaselineTableData.length === 0,
                    IdToDelete: '',
                    totalBaselines: newBaselineTableData.length
                };
            case `DELETE_BASELINE_${tableId}_REJECTED`:
                return {
                    ...state,
                    loading: false,
                    IdToDelete: ''
                };
            case `UPDATE_BASELINES_PAGINATION_${tableId}`:
                rows = baselinesReducerHelpers.buildBaselinesTable(state.fullBaselineListData, state.selectedBaselineIds);
                paginatedRows = helpers.paginateData(rows, action.payload.page, action.payload.perPage);
                return {
                    ...state,
                    baselineTableData: paginatedRows,
                    page: action.payload.page,
                    perPage: action.payload.perPage,
                    totalBaselines: rows.length
                };
            default:
                return state;
        }
    };

    return tableReducer;
};

export default baselinesTableReducer;
