import types from './types';
import editBaselineHelpers from '../EditBaseline/helpers';
import helpers from '../../../helpers';
import { ASC, FACT_VALUE } from '../../../../constants';
import reducerHelpers from '../../../modules/helpers';

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
    editBaselineEmptyState: false,
    notificationsSwitchError: {},
    nameSort: ASC,
    valueSort: ''
};

export function editBaselineReducer(state = initialState, action) {
    let errorObject = {};
    let newEditBaselineTableData = [];
    let newExpandedRows = [];
    let response;
    let error;
    let sortedFacts;

    switch (action.type) {
        case `${types.FETCH_BASELINE_DATA}_PENDING`:
            return {
                ...state,
                baselineDataLoading: true,
                editBaselineError: {},
                notificationsSwitchError: {}
            };
        case `${types.FETCH_BASELINE_DATA}_FULFILLED`:
            newEditBaselineTableData = editBaselineHelpers.buildBaselineTableData(action.payload.baseline_facts);
            newEditBaselineTableData = reducerHelpers.sortNameEditBaselineTableData(newEditBaselineTableData, state.nameSort);
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
            helpers.downloadHelper(action.payload);
            return {
                ...state
            };
        case `${types.EXPORT_BASELINE_DATA_TO_JSON}`:
            helpers.downloadHelper(action.payload);
            return {
                ...state
            };
        case `${types.TOGGLE_NOTIFICATIONS_SWITCH}_PENDING`:
            return {
                ...state,
                notificationsSwitchError: {}
            };
        case `${types.TOGGLE_NOTIFICATIONS_SWITCH}_FULFILLED`:
            return {
                ...state
            };
        case `${types.TOGGLE_NOTIFICATIONS_SWITCH}_REJECTED`:
            error = action.payload.error.response;

            if (error.status !== 200) {
                errorObject = {
                    detail: `Notifications toggle failed for ${ action.payload.display_name }. ` + error.data.detail,
                    status: error.status,
                    id: action.payload.id
                };
            }

            return {
                ...state,
                notificationsSwitchError: errorObject
            };
        case types.TOGGLE_FACT :
            sortedFacts = reducerHelpers.sortNameEditBaselineTableData(state.editBaselineTableData, action.payload);
            return {
                ...state,
                nameSort: action.payload,
                valueSort: '',
                editBaselineTableData: sortedFacts
            };
        case types.TOGGLE_VALUE :
            sortedFacts = reducerHelpers.sortValueEditBaselineTableData(state.editBaselineTableData, action.payload);
            return {
                ...state,
                valueSort: action.payload,
                nameSort: (action.payload === '') ? ASC : '',
                editBaselineTableData: sortedFacts
            };
        default:
            return state;
    }
}
