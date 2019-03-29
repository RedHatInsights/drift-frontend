import types from './types';
import api from '../../api';

function fetchCompare(systemIds) {
    return {
        type: types.FETCH_COMPARE,
        payload: api.getCompare(systemIds)
    };
}

function clearState() {
    return {
        type: types.CLEAR_STATE
    };
}

function toggleAddSystemModal() {
    return {
        type: types.OPEN_ADD_SYSTEM_MODAL
    };
}

function resetSelectedSystemIds() {
    return {
        type: types.RESET_SELECTED_SYSTEM_IDS
    };
}

function toggleFilterDropDown() {
    return {
        type: types.OPEN_FILTER_DROPDOWN
    };
}

function toggleFactSort(sortType) {
    return {
        type: types.TOGGLE_FACT_SORT,
        payload: sortType
    };
}

function filterByState(filter) {
    return {
        type: types.FILTER_BY_STATE,
        payload: filter
    };
}

function filterByFact(filter) {
    return {
        type: types.FILTER_BY_FACT,
        payload: filter
    };
}

function updatePagination(pagination) {
    return {
        type: types.UPDATE_PAGINATION,
        payload: pagination
    };
}

function exportToCSV() {
    return {
        type: types.EXPORT_TO_CSV
    };
}

export default {
    fetchCompare,
    clearState,
    toggleAddSystemModal,
    resetSelectedSystemIds,
    toggleFilterDropDown,
    toggleFactSort,
    filterByState,
    filterByFact,
    updatePagination,
    exportToCSV
};
