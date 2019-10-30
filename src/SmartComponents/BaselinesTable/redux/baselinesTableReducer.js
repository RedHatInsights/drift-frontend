import types from './types';
import baselinesReducerHelpers from './helpers';
import union from 'lodash/union';

const initialState = {
    baselineListLoading: true,
    baselineDeleteLoading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    selectedBaselineIds: [],
    IdToDelete: '',
    emptyState: false
};

export function baselinesTableReducer(state = initialState, action) {
    let rows = [];
    let selectedBaselines = [];
    let newBaselineTableData = [];
    let newFullBaselineList;

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
        case `${types.SELECT_ONE_BASELINE}`:
            selectedBaselines = [ ...state.selectedBaselineIds ];

            if (action.payload.id === '') {
                selectedBaselines = [];
            } else if (action.payload.isSelected) {
                selectedBaselines.pop();
                selectedBaselines.push(action.payload.id);
            } else if (!action.payload.isSelected) {
                selectedBaselines.pop();
            }

            state.baselineTableData.map(row => {
                if (action.payload.id.includes(row[0])) {
                    row.selected = action.payload.isSelected;
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
                emptyState: newBaselineTableData.length === 0,
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
