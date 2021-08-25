import types from './types';
import { ASC, DESC } from '../../constants';
import reducerHelpers from './helpers';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';

const initialState = {
    fullCompareData: [],
    filteredCompareData: [],
    sortedFilteredFacts: [],
    referenceId: undefined,
    systems: [],
    baselines: [],
    historicalProfiles: [],
    previousStateSystems: [],
    stateFilters: [
        {
            filter: 'SAME',
            display: 'Same',
            selected: true
        },
        {
            filter: 'DIFFERENT',
            display: 'Different',
            selected: true
        },
        {
            filter: 'INCOMPLETE_DATA',
            display: 'Incomplete data',
            selected: true
        }
    ],
    factFilter: '',
    activeFactFilters: [],
    totalFacts: 0,
    page: 1,
    factSort: ASC,
    stateSort: DESC,
    perPage: 50,
    loading: false,
    expandedRows: [],
    error: {},
    emptyState: true
};

export function compareReducer(state = initialState, action) {
    let filteredFacts;
    let sortedFacts;
    let paginatedFacts;
    let newExpandedRows;
    let errorObject = {};
    let response;
    let updatedStateFilters = [];
    let newStateFilters;
    let newActiveFactFilters = [];
    let index;
    let newFactFilter;

    switch (action.type) {
        case types.CLEAR_COMPARISON:
            return {
                ...initialState,
                stateFilters: state.stateFilters,
                factFilter: state.factFilter,
                activeFactFilters: state.activeFactFilters,
                factSort: state.factSort,
                stateSort: state.stateSort,
                perPage: state.perPage,
                expandedRows: [],
                historicalProfiles: []
            };
        case types.CLEAR_COMPARISON_FILTERS:
            newStateFilters = [ ...state.stateFilters ];
            newStateFilters.forEach(function(stateFilter) { stateFilter.selected = false; });
            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, newStateFilters, initialState.factFilter, state.referenceId, state.activeFactFilters
            );
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            return {
                ...state,
                filteredCompareData: filteredFacts,
                sortedFilteredFacts: sortedFacts,
                stateFilters: newStateFilters,
                factFilter: '',
                activeFactFilters: [],
                totalFacts: filteredFacts.length,
                page: 1
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
            filteredFacts = reducerHelpers.filterCompareData(
                action.payload.facts, state.stateFilters, state.factFilter, state.referenceId, state.activeFactFilters
            );
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
                loading: false,
                error: errorObject,
                emptyState: true
            };
        case `${types.UPDATE_DRIFT_PAGINATION}`:
            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, state.stateFilters, state.factFilter, state.referenceId, state.activeFactFilters
            );
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
            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, updatedStateFilters, state.factFilter, state.referenceId, state.activeFactFilters
            );
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
            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, state.stateFilters, action.payload, state.referenceId, state.activeFactFilters
            );
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
        case `${types.HANDLE_FACT_FILTER}`:
            newActiveFactFilters = [ ...state.activeFactFilters ];
            index = reducerHelpers.findFilterIndex(action.payload, state.activeFactFilters);

            if (index > -1) {
                newActiveFactFilters.splice(index, 1);
                newFactFilter = state.factFilter;
            } else {
                newActiveFactFilters.push(action.payload);
                newFactFilter = '';
            }

            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, state.stateFilters, newFactFilter, state.referenceId, newActiveFactFilters
            );
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, 1, state.perPage);

            return {
                ...state,
                factFilter: newFactFilter,
                activeFactFilters: newActiveFactFilters,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.CLEAR_ALL_FACT_FILTERS}`:
            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, state.stateFilters, '', state.referenceId, newActiveFactFilters
            );
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                factFilter: '',
                activeFactFilters: [],
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.TOGGLE_FACT_SORT}`:
            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, state.stateFilters, state.factFilter, state.referenceId, state.activeFactFilters
            );
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
            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, state.stateFilters, state.factFilter, state.referenceId, state.activeFactFilters
            );
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
            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, state.stateFilters, state.factFilter, state.referenceId, state.activeFactFilters
            );
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, state.page, state.perPage);
            return {
                ...state,
                expandedRows: newExpandedRows,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.UPDATE_REFERENCE_ID}`:
            return {
                ...state,
                referenceId: action.payload
            };
        case `${types.RESET_COMPARISON_FILTERS}`:
            newStateFilters = [
                {
                    filter: 'SAME',
                    display: 'Same',
                    selected: true
                },
                {
                    filter: 'DIFFERENT',
                    display: 'Different',
                    selected: true
                },
                {
                    filter: 'INCOMPLETE_DATA',
                    display: 'Incomplete data',
                    selected: true
                }
            ];

            filteredFacts = reducerHelpers.filterCompareData(
                state.fullCompareData, newStateFilters, '', state.referenceId, []
            );
            sortedFacts = reducerHelpers.sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = reducerHelpers.paginateData(sortedFacts, 1, state.perPage);

            return {
                ...state,
                stateFilters: newStateFilters,
                factFilter: '',
                activeFactFilters: [],
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

export const globalFilterReducer = applyReducerHash({
    [types.SET_GLOBAL_FILTER_TAGS]: (state = {}, action) => ({
        ...state,
        tagsFilter: action.payload
    }),
    [types.SET_GLOBAL_FILTER_WORKLOADS]: (state = {}, action) => ({
        ...state,
        workloadsFilter: action.payload
    }),
    [types.SET_GLOBAL_FILTER_SIDS]: (state = {}, action) => ({
        ...state,
        sidsFilter: action.payload
    })
});
