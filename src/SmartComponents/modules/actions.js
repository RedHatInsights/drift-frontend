import types from './types';
import api from '../../api';

function fetchCompare(systemIds) {
    return {
        type: types.FETCH_COMPARE,
        payload: api.getCompare(systemIds)
    };
}

function toggleAddSystemModal() {
    return {
        type: types.OPEN_ADD_SYSTEM_MODAL
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

export default {
    fetchCompare,
    toggleAddSystemModal,
    toggleFilterDropDown,
    toggleFactSort,
    filterByState,
    filterByFact,
    updatePagination
};
