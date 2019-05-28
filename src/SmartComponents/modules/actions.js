import types from './types';
import api from '../../api';
import { ASC, DESC } from '../../constants';

function fetchCompare(systemIds) {
    return {
        type: types.FETCH_COMPARE,
        payload: api.getCompare(systemIds)
    };
}

function revertCompareData(fetchCompareData) {
    return {
        type: types.REVERT_COMPARE_DATA,
        payload: fetchCompareData
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

function toggleErrorAlert() {
    return {
        type: types.OPEN_ERROR_MODAL
    };
}

function setSelectedSystemIds(selectedSystemIds) {
    return {
        type: types.SET_SELECTED_SYSTEM_IDS,
        payload: { selectedSystemIds }
    };
}

function toggleFilterDropDown() {
    return {
        type: types.OPEN_FILTER_DROPDOWN
    };
}

function toggleFactSort(currentSort) {
    return {
        type: types.TOGGLE_FACT_SORT,
        payload: currentSort === ASC ? DESC : ASC
    };
}

function toggleStateSort(currentSort) {
    let newSort;

    if (currentSort === ASC) {
        newSort = DESC;
    }
    else if (currentSort === DESC) {
        newSort = '';
    } else {
        newSort = ASC;
    }

    return {
        type: types.TOGGLE_STATE_SORT,
        payload: newSort
    };
}

function addStateFilter(filterData) {
    filterData.selected = !filterData.selected;
    return {
        type: types.ADD_STATE_FILTER,
        payload: filterData
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

function expandRow(factName) {
    return {
        type: types.EXPAND_ROW,
        payload: factName
    };
}

function toggleKebab() {
    return {
        type: types.TOGGLE_KEBAB
    };
}

export default {
    fetchCompare,
    revertCompareData,
    clearState,
    toggleAddSystemModal,
    toggleErrorAlert,
    setSelectedSystemIds,
    toggleFilterDropDown,
    toggleFactSort,
    addStateFilter,
    toggleStateSort,
    filterByFact,
    updatePagination,
    exportToCSV,
    expandRow,
    toggleKebab
};
