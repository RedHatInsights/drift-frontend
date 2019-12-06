import types from './types';
import baselinesReducerHelpers from './helpers';
import union from 'lodash/union';

const initialState = {
    baselineListLoading: true,
    baselineDeleteLoading: false,
    fullBaselineListData: [],
    baselineTableData: [],
    modalTableData: [],
    selectedBaselineIds: [],
    emptyState: false
};

export function baselinesTableReducer(state = initialState, action) {
    let rows = [];
    let selectedBaselines = [];
    let newBaselineTableData = [];
    let newModalTableData = [];

    switch (action.type) {
        case `${types.FETCH_BASELINE_LIST}_PENDING`:
            return {
                ...state,
                baselineListLoading: true
            };
        case `${types.FETCH_BASELINE_LIST}_FULFILLED`:
            rows = baselinesReducerHelpers.buildBaselinesTable(
                action.payload.data.data,
                action.payload.isModal ? [] : state.selectedBaselineIds);
            return {
                ...state,
                baselineListLoading: false,
                fullBaselineListData: action.payload.data.data,
                emptyState: action.payload.data.meta.total_available === 0,
                baselineTableData: !action.payload.isModal ? rows : state.baselineTableData,
                modalTableData: action.payload.isModal ? rows : state.modalTableData
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
            newModalTableData = [ ...state.modalTableData ];
            newModalTableData.forEach((baseline) => {
                baseline.selected = false;
                if (baseline[0] === action.payload) {
                    baseline.selected = true;
                }
            });
            return {
                ...state,
                modalTableData: newModalTableData
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

        default:
            return state;
    }
}
