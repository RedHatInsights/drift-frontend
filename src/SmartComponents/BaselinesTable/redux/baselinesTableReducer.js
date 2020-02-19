import baselinesReducerHelpers from './helpers';
import union from 'lodash/union';

const initialState = {
    loading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    selectedBaselineIds: [],
    IdToDelete: '',
    emptyState: false
};

const baselinesTableReducer = (tableId = '') => {
    const tableReducer = (state = initialState, action) => {
        let rows = [];
        let selectedBaselines = [];
        let newBaselineTableData = [];
        let newFullBaselineList;

        switch (action.type) {
            case `FETCH_BASELINE_LIST_${tableId}_PENDING`:
                return {
                    ...state,
                    loading: true
                };
            case `FETCH_BASELINE_LIST_${tableId}_FULFILLED`:
                rows = baselinesReducerHelpers.buildBaselinesTable(action.payload.data, state.selectedBaselineIds, tableId);
                return {
                    ...state,
                    loading: false,
                    fullBaselineListData: action.payload.data,
                    emptyState: action.payload.meta.total_available === 0,
                    baselineTableData: rows
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
                newBaselineTableData = baselinesReducerHelpers.buildNewTableData(state.fullBaselineListData, state.IdToDelete);
                newFullBaselineList = baselinesReducerHelpers.buildNewBaselineList(state.fullBaselineListData, state.IdToDelete);
                return {
                    ...state,
                    loading: false,
                    baselineTableData: newBaselineTableData,
                    fullBaselineListData: newFullBaselineList,
                    emptyState: newBaselineTableData.length === 0,
                    IdToDelete: ''
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
