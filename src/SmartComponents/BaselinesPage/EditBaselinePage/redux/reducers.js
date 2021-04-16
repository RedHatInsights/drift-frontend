import types from './types';
import editBaselineHelpers from '../EditBaseline/helpers';
import helpers from '../../../helpers';
import { FACT_VALUE } from '../../../../constants';

const initialState = {
    baselineData: undefined,
    baselineDataLoading: false,
    editBaselineTableData: [],
    editBaselineError: {},
    inlineError: {},
    expandedRows: [],
    factModalOpened: false,
    factName: '',
    factValue: '',
    factData: [],
    isCategory: false,
    isSubFact: false,
    editBaselineEmptyState: false
};

export function editBaselineReducer(state = initialState, action) {
    let errorObject = {};
    let newEditBaselineTableData = [];
    let newExpandedRows = [];
    let response;

    switch (action.type) {
        case `${types.FETCH_BASELINE_DATA}_PENDING`:
            return {
                ...state,
                baselineDataLoading: true
            };
        case `${types.FETCH_BASELINE_DATA}_FULFILLED`:
            newEditBaselineTableData = editBaselineHelpers.buildBaselineTableData(action.payload.baseline_facts);
            return {
                ...state,
                baselineDataLoading: false,
                baselineData: action.payload,
                editBaselineTableData: newEditBaselineTableData,
                editBaselineEmptyState: action.payload.baseline_facts.length === 0
            };
        case `${types.FETCH_BASELINE_DATA}_REJECTED`:
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
                editBaselineError: errorObject,
                editBaselineEmptyState: true
            };
        case `${types.CLEAR_EDIT_BASELINE_DATA}`:
            return {
                ...state,
                baselineData: undefined,
                editBaselineTableData: [],
                expandedRows: []
            };
        case `${types.PATCH_BASELINE}_PENDING`:
            return {
                ...state,
                inlineError: {},
                baselineDataLoading: true
            };
        case `${types.PATCH_BASELINE}_FULFILLED`:
            return {
                ...state,
                baselineDataLoading: false,
                baselineData: action.payload.data[0]
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
                inlineError: errorObject
            };
        case `${types.DELETE_BASELINE_DATA}_PENDING`:
            return {
                ...state,
                baselineDataLoading: true
            };
        case `${types.DELETE_BASELINE_DATA}_FULFILLED`:
            return {
                ...state,
                baselineDataLoading: false,
                baselineData: action.payload.data[0],
                editBaselineEmptyState: action.payload.data[0].baseline_facts.length < 1
            };
        case `${types.DELETE_BASELINE_DATA}_REJECTED`:
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
                editBaselineError: errorObject
            };
        case `${types.EXPAND_PARENT_FACT}`:
            newExpandedRows = editBaselineHelpers.toggleExpandedRow(state.expandedRows, action.payload);
            return {
                ...state,
                expandedRows: newExpandedRows
            };
        case `${types.TOGGLE_FACT_MODAL}`:
            return {
                ...state,
                editBaselineError: {},
                factModalOpened: !state.factModalOpened,
                inlineError: {}
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
        case `${types.SELECT_FACT}`:
            newEditBaselineTableData = [ ...state.editBaselineTableData ];

            newEditBaselineTableData.map(row => {
                let factId = row[0];
                if (action.payload.ids.includes(factId)) {
                    row.selected = action.payload.isSelected;
                }

                if (editBaselineHelpers.isCategory(row) && row[FACT_VALUE].length > 0) {
                    editBaselineHelpers.baselineSubFacts(row).map(subFact => {
                        let subFactId = subFact[0];
                        if (action.payload.ids.includes(subFactId)) {
                            subFact.selected = action.payload.isSelected;
                        }
                    });

                    row.selected = editBaselineHelpers.isAllSelected(editBaselineHelpers.baselineSubFacts(row));
                }
            });

            return {
                ...state,
                editBaselineTableData: newEditBaselineTableData.slice()
            };
        case `${types.CLEAR_ERROR_DATA}`:
            return {
                ...state,
                editBaselineError: {},
                inlineError: {},
                baselineDataLoading: false
            };
        case `${types.EXPORT_BASELINE_DATA_TO_CSV}`:
            helpers.downloadCSV(action.payload);
            return {
                ...state
            };

        default:
            return state;
    }
}
