import types from './types';
import { ASC, DESC } from '../../constants';
import reducerHelpers from './helpers';

const initialState = {
    fullCompareData: [],
    filteredCompareData: [],
    sortedFilteredFacts: [],
    systems: [],
    baselines: [],
    historicalProfiles: [],
    previousStateSystems: [],
    stateFilters: [
        { filter: 'SAME', display: 'Same', selected: true },
        { filter: 'DIFFERENT', display: 'Different', selected: true },
        { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
    ],
    factFilter: '',
    totalFacts: 0,
    page: 1,
    factSort: ASC,
    stateSort: DESC,
    perPage: 50,
    loading: false,
    expandedRows: [],
    error: {},
    emptyState: false
};

export function compareReducer(state = initialState, action) {
    let filteredFacts;
    let sortedFacts;
    let paginatedFacts;
    let newExpandedRows;
    let errorObject = {};
    let response;
    let updatedStateFilters = [];

    switch (action.type) {
        case types.CLEAR_STATE:
            state.stateFilters.forEach(function(stateFilter) { stateFilter.selected = true; });
            return {
                ...initialState
            };
        case types.REVERT_COMPARE_DATA:
            return {
                ...state,
                loading: false,
                error: {},
                systems: state.previousStateSystems
            };
        case `${types.FETCH_COMPARE}_PENDING`:
            return {
                ...state,
                previousStateSystems: state.systems,
                systems: [],
                baselines: [],
                historicalProfiles: [],
                loading: true,
                emptyState: false
            };
        case `${types.FETCH_COMPARE}_FULFILLED`:
            filteredFacts = reducerHelpers.filterCompareData(action.payload.facts, state.stateFilters, state.factFilter);
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, 1, state.perPage);

            return {
                ...state,
                loading: false,
                fullCompareData: action.payload.facts,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                systems: action.payload.systems || [],
                baselines: action.payload.baselines || [],
                historicalProfiles: action.payload.historical_system_profiles || [],
                page: 1,
                totalFacts: filteredFacts.length,
                emptyState: (action.payload.systems.concat(action.payload.baselines).concat(action.payload.historical_system_profiles)).length === 0
            };
        case `${types.FETCH_COMPARE}_REJECTED`:
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
                error: errorObject,
                emptyState: false
            };
        case `${types.UPDATE_PAGINATION}`:
            filteredFacts = reducerHelpers.filterCompareData(state.fullCompareData, state.stateFilters, state.factFilter);
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, action.payload.page, action.payload.perPage);
            return {
                ...state,
                page: action.payload.page,
                perPage: action.payload.perPage,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.ADD_STATE_FILTER}`:
            updatedStateFilters = reducerHelpers.updateStateFilters(state.stateFilters, action.payload);
            filteredFacts = reducerHelpers.filterCompareData(state.fullCompareData, updatedStateFilters, state.factFilter);
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                stateFilters: updatedStateFilters,
                page: 1,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.FILTER_BY_FACT}`:
            filteredFacts = reducerHelpers.filterCompareData(state.fullCompareData, state.stateFilters, action.payload);
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                factFilter: action.payload,
                page: 1,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.TOGGLE_FACT_SORT}`:
            filteredFacts = reducerHelpers.filterCompareData(state.fullCompareData, state.stateFilters, state.factFilter);
            sortedFacts = reducerHelpers.sortData(filteredFacts, action.payload, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                page: 1,
                factSort: action.payload,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.TOGGLE_STATE_SORT}`:
            filteredFacts = reducerHelpers.filterCompareData(state.fullCompareData, state.stateFilters, state.factFilter);
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, action.payload);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                page: 1,
                stateSort: action.payload,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.EXPORT_TO_CSV}`:
            reducerHelpers.downloadCSV(state.sortedFilteredFacts, [ ...state.baselines, ...state.systems, ...state.historicalProfiles ]);
            return {
                ...state
            };
        case `${types.EXPAND_ROW}`:
            newExpandedRows = reducerHelpers.toggleExpandedRow(state.expandedRows, action.payload);
            filteredFacts = reducerHelpers.filterCompareData(state.fullCompareData, state.stateFilters, state.factFilter);
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, state.page, state.perPage);
            return {
                ...state,
                expandedRows: newExpandedRows,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };

        default:
            return {
                ...state
            };
    }
}
