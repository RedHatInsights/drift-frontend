import types from './types';
import api from '../../api';
import { ASC, DESC } from '../../constants';

function fetchCompare(systemIds, baselineIds, systemHSPIds, referenceId) {
    return {
        type: types.FETCH_COMPARE,
        payload: api.getCompare(systemIds, baselineIds, systemHSPIds, referenceId)
    };
}

function revertCompareData() {
    return {
        type: types.REVERT_COMPARE_DATA
    };
}

function clearComparison() {
    return {
        type: types.CLEAR_COMPARISON
    };
}

function clearComparisonFilters() {
    return {
        type: types.CLEAR_COMPARISON_FILTERS
    };
}

function setSelectedSystemIds(selectedSystemIds) {
    return {
        type: types.SET_SELECTED_SYSTEM_IDS,
        payload: { selectedSystemIds }
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

function toggleFactTypeFilter(filterData) {
    filterData.selected = !filterData.selected;
    return {
        type: types.TOGGLE_FACT_TYPE_FILTER,
        payload: filterData
    };
}

function filterByFact(filter) {
    return {
        type: types.FILTER_BY_FACT,
        payload: filter
    };
}

function handleFactFilter(filter) {
    return {
        type: types.HANDLE_FACT_FILTER,
        payload: filter
    };
}

function clearAllFactFilters() {
    return {
        type: types.CLEAR_ALL_FACT_FILTERS
    };
}

function updatePagination(pagination) {
    return {
        type: types.UPDATE_DRIFT_PAGINATION,
        payload: pagination
    };
}

function exportToCSV() {
    return {
        type: types.EXPORT_TO_CSV
    };
}

function exportToJSON() {
    return {
        type: types.EXPORT_TO_JSON
    };
}

function resetExportStatus() {
    return {
        type: types.RESET_EXPORT_STATUS
    };
}

function expandRow(factName) {
    return {
        type: types.EXPAND_ROW,
        payload: factName
    };
}

function updateReferenceId(id) {
    return {
        type: types.UPDATE_REFERENCE_ID,
        payload: id
    };
}

function setGlobalFilterTags(tags = []) {
    return {
        type: types.SET_GLOBAL_FILTER_TAGS,
        payload: tags
    };
}

function setGlobalFilterWorkloads(workloads = []) {
    return {
        type: types.SET_GLOBAL_FILTER_WORKLOADS,
        payload: workloads
    };
}

function setGlobalFilterSIDs(SIDs = []) {
    return {
        type: types.SET_GLOBAL_FILTER_SIDS,
        payload: SIDs
    };
}

function resetComparisonFilters() {
    return {
        type: types.RESET_COMPARISON_FILTERS
    };
}

export default {
    fetchCompare,
    revertCompareData,
    clearComparison,
    clearComparisonFilters,
    setSelectedSystemIds,
    toggleFactSort,
    addStateFilter,
    toggleFactTypeFilter,
    toggleStateSort,
    filterByFact,
    handleFactFilter,
    clearAllFactFilters,
    updatePagination,
    exportToCSV,
    exportToJSON,
    resetExportStatus,
    expandRow,
    updateReferenceId,
    setGlobalFilterTags,
    setGlobalFilterWorkloads,
    setGlobalFilterSIDs,
    resetComparisonFilters
};
