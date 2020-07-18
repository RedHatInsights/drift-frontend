import baselinesReducerHelpers from './helpers';
import union from 'lodash/union';

const initialState = {
    loading: false,
    baselineTableData: [],
    selectedBaselineIds: [],
    IdToDelete: '',
    emptyState: false,
    baselineError: {},
    totalBaselines: 0
};

const baselinesTableReducer = (tableId = '') => {
    const tableReducer = (state = initialState, action) => {
        let rows = [];
        let selectedBaselines = [];
        let newBaselineTableData = [];
        let response;
        let errorObject;

        switch (action.type) {
            case `FETCH_BASELINE_LIST_${tableId}_PENDING`:
                return {
                    ...state,
                    loading: true
                };
            case `FETCH_BASELINE_LIST_${tableId}_FULFILLED`:
                rows = baselinesReducerHelpers.buildBaselinesTable(action.payload.data, state.selectedBaselineIds);

                return {
                    ...state,
                    loading: false,
                    emptyState: action.payload.meta.total_available === 0,
                    baselineTableData: rows,
                    totalBaselines: action.payload.meta.count
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
                newBaselineTableData = [ ...state.baselineTableData ];
                rows = baselinesReducerHelpers.setSelected(newBaselineTableData, state.selectedBaselineIds);

                return {
                    ...state,
                    baselineTableData: rows,
                    selectedBaselineIds: action.payload
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
                rows = baselinesReducerHelpers.buildBaselinesTable(action.payload.data, state.selectedBaselineIds);

                return {
                    ...state,
                    loading: false,
                    baselineTableData: rows,
                    emptyState: action.payload.meta.total_available === 0,
                    IdToDelete: '',
                    totalBaselines: action.payload.meta.count
                };
            case `DELETE_BASELINE_${tableId}_REJECTED`:
                return {
                    ...state,
                    loading: false,
                    IdToDelete: ''
                };
            default:
                return state;
        }
    };

    return tableReducer;
};

export default baselinesTableReducer;
